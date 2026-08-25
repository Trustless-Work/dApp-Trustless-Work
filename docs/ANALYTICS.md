# AI guide: integrating Analytics endpoints in the backoffice

> Context document for the backoffice developer's AI assistant.
> These are **guides, not orders**: they describe the contract, edge cases, and
> practices that make the integration work on the first try. UI and frontend
> architecture decisions stay with whoever implements this.

## Context

The Trustless Work Core API exposes five aggregate endpoints designed for the
backoffice dashboard: monthly growth, revenue by token, status funnel, and data
completeness. The backoffice already talks to other endpoints on this same API,
so **reuse the existing auth layer and HTTP client as-is** — nothing new to
configure beyond the key's role.

- **Base URL:** `https://beta.api.trustlesswork.com`
- **Source of truth:** the live OpenAPI at
  `https://beta.api.trustlesswork.com/api/analytics-json` (human UI at
  `/docs/analytics`). If this document and the OpenAPI disagree on anything,
  **the OpenAPI wins** — have the AI download it and use it as the source when
  generating types or clients.
- **Auth:** `x-api-key` header, same as the rest of the API, but these
  endpoints require the **`BACKOFFICE_ADMIN`** role. A key without that role
  gets `403` with `requiredAnyOf: ["BACKOFFICE_ADMIN"]` — that error means
  "wrong key", not "bug": do not retry; tell the user.
- Quick check that the key works:

```bash
curl https://beta.api.trustlesswork.com/analytics/data-quality -H "x-api-key: $KEY"
```

## Principles that prevent classic mistakes

These four points are where a naive integration produces wrong numbers.
Worth keeping in mind for every decision:

1. **Amounts are exact decimal strings, not numbers.** `releasedAmount` and
   `feeAmount` can exceed JS `number` precision. Displaying them as strings is
   fine; for arithmetic (totals, percentages), prefer a decimal library
   (`big.js`, `decimal.js`) or `BigInt` over scaled values. Avoid `parseFloat`
   for calculations.
2. **Never add amounts from different tokens.** Each revenue bucket belongs to
   ONE token (`asset.address`). USDC + EURC + a custom token do not share a
   unit; the API deliberately does not offer a "global total" because that
   number would be meaningless. A stacked chart by token is the correct
   representation: each token is its own series.
3. **Months are UTC keys (`"2026-08"`), not dates.** Treat them as strings for
   axes and grouping. Avoid `new Date("2026-08")` to derive labels: depending
   on the browser timezone it can shift to the previous month.
4. **Data is eventually consistent** (indexer projection, seconds of lag
   relative to the chain). For a dashboard this is irrelevant in practice, but
   it explains why a refetch immediately after an on-chain action may not
   reflect it yet. A relaxed refresh interval (30–60 s) or a manual refetch is
   more than enough; aggressive polling is not needed.

## The five endpoints

All are `GET`, with no pagination, and a flat JSON response. The first three
accept `?months=N` (integer, 1–36, default 12; out of range → `400`).

### 1. `GET /analytics/escrows/monthly?months=12`

Monthly series of created escrows, with month-over-month growth.

```json
{
  "network": "testnet",
  "data": [
    { "month": "2026-06", "count": 25, "growthPct": null },
    { "month": "2026-07", "count": 0,  "growthPct": -100 },
    { "month": "2026-08", "count": 12, "growthPct": null }
  ]
}
```

Guides:
- The series is **always continuous**: months with no activity come with
  `count: 0`. No need to fill gaps on the frontend.
- `growthPct` is computed by the backend (one decimal; negative = drop).
  It is `null` on the first bucket and when the previous month was 0 — in the
  UI, render it as "—" or empty, **not as 0** (0 means "no change", which is
  something else).
- `network` indicates the deployment network; it can be shown as a badge, but
  there is nothing to filter with it.

### 2. `GET /analytics/users/monthly?months=12`

Same shape as the previous one (without `network`): user sign-ups by month.
The same continuous-series and `growthPct` guides apply.

### 3. `GET /analytics/revenue/monthly?months=12`

Trustless Work's take: 0.3% of released value, by month × token × category.

```json
{
  "network": "testnet",
  "feeBps": 30,
  "data": [
    {
      "month": "2026-08",
      "asset": {
        "address": "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
        "symbol": "USDC",
        "decimals": 7,
        "resolved": true
      },
      "category": "released",
      "releasedAmount": "1250.5",
      "feeAmount": "3.7515",
      "escrowCount": 7
    }
  ]
}
```

Guides:
- `category` is `"released"` (released without a dispute) or `"resolved"` (the
  escrow went through a dispute that was resolved). They are **disjoint**: an
  escrow counts in exactly one. That is why they are stackable and addable
  **within the same token**:
  - "Combined take" chart: add both categories per token.
  - "Released vs resolved separately" chart: one series per category.
  - "Take by token, stacked" chart: one series per token (`asset.symbol` or,
    if null, a truncated `asset.address` as the legend label).
- Unlike the count series, **empty months are not filled here** (a month with
  no releases simply has no buckets). If the chart needs a continuous axis,
  fill with 0 on the frontend using the month keys.
- `asset.resolved: false` means the token decimals are not confirmed (7 was
  assumed). The amount may be mis-scaled for exotic tokens — mark it visually
  (asterisk, tooltip) rather than hiding it.
- `feeBps` comes in the response (30 = 0.3%) in case the UI wants to show the
  rate; there is no need to recompute the fee on the frontend — it already
  comes computed in `feeAmount`.

### 4. `GET /analytics/escrows/status`

Funnel of live escrows by status. No parameters.

```json
{
  "network": "testnet",
  "data": [
    { "status": "active", "count": 20 },
    { "status": "released", "count": 5 }
  ],
  "removedCount": 0,
  "shellCount": 0
}
```

Guides:
- The current `status` vocabulary is `active` / `released` / `disputed`, and
  it can come as `null` (projected escrow with no derivable status). Map those
  values with their own label and color, and keep an "other" bucket for any
  unrecognized future value — so a new contract version does not silently
  disappear from the chart.
- A status with 0 escrows does not appear in `data` — if the UI wants to show
  all three always, fill with 0.
- `removedCount` and `shellCount` are the escrows deliberately excluded from
  the funnel (no longer exist on-chain / still have no status). Showing them
  as a footnote makes totals add up for anyone comparing numbers.

### 5. `GET /analytics/data-quality`

The dashboard's honesty counters. No parameters.

```json
{
  "network": "testnet",
  "openGaps": 0,
  "shellRows": 0,
  "removedEscrows": 0,
  "missingChainClock": 0,
  "unbackfilledReleased": 0
}
```

Guides:
- Recommended pattern: if **any** counter is > 0, show a discreet banner like
  "data may be incomplete" with the detail in a tooltip. With everything at 0
  (the normal state), show nothing.
- The most important one is `openGaps`: it means there are ranges of the chain
  the system did not process, so the other charts may undercount without it
  being obvious.
- It is a cheap endpoint; it can be fetched with every dashboard refresh.

## Suggested types (TypeScript)

Generating them from the OpenAPI is ideal; if they are written by hand, these
match the current contract:

```typescript
interface MonthlyGrowthPoint {
  month: string;            // "YYYY-MM", UTC key
  count: number;
  growthPct: number | null; // null = not computable, render as "—"
}

interface EscrowGrowthResponse { network: string; data: MonthlyGrowthPoint[]; }
interface UserGrowthResponse   { data: MonthlyGrowthPoint[]; }

interface RevenueBucket {
  month: string;
  asset: {
    address: string;
    symbol: string | null;
    decimals: number;
    resolved: boolean;      // false = assumed decimals, mark the amount
  };
  category: 'released' | 'resolved';
  releasedAmount: string;   // exact decimal — NOT number
  feeAmount: string;        // exact decimal — NOT number
  escrowCount: number;
}

interface RevenueByTokenResponse { network: string; feeBps: number; data: RevenueBucket[]; }

interface StatusFunnelResponse {
  network: string;
  data: { status: string | null; count: number }[];
  removedCount: number;
  shellCount: number;
}

interface DataQualityResponse {
  network: string;
  openGaps: number;
  shellRows: number;
  removedEscrows: number;
  missingChainClock: number;
  unbackfilledReleased: number;
}
```

## Error handling

Same error family as the rest of the API (Problem Details):

| Status | Meaning | Suggested reaction |
|---|---|---|
| `401 AUTH_CREDENTIAL_MISSING` / invalid | Key missing or failed | Same treatment as the rest of the backoffice |
| `403` with `requiredAnyOf: ["BACKOFFICE_ADMIN"]` | The key does not have the role | Clear message to the user; do not retry |
| `400` | `months` outside 1–36 or not numeric | Validate on the client before calling |
| `429` | Rate limit (API-wide) | Backoff; with a 30–60 s refresh it should not happen |

## Verification checklist when done

Suggestions to validate the integration, not mandatory steps:

- [ ] With the real key, all five endpoints return 200 (start with `data-quality`).
- [ ] A month with no activity appears on growth charts as 0, not as a gap.
- [ ] `growthPct: null` is shown as "—" (not as 0%).
- [ ] The combined revenue chart adds categories only within the same token,
      and nowhere in the UI is there a "total" that mixes tokens.
- [ ] Amounts are displayed as-is (string) or operated on with safe decimals.
- [ ] An `asset.resolved: false` is visually distinct.
- [ ] The data-quality banner appears if a counter > 0 is forced in a mock.
- [ ] An unknown `status` in the funnel falls into "other" instead of disappearing.
