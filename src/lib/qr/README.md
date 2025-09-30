# QR Escrow Deposit Component

A React component that generates QR codes for depositing funds to Stellar escrow contracts (Soroban). Supports multiple encoding strategies to maximize wallet compatibility.

## Quick Start

```tsx
<QREscrowDeposit
  escrowAddress="CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V"
  network="testnet"
  assetCode="USDC"
  amount="100"
  encoding="auto"
  size={220}
  caption={true}
/>
```

## Demo Page

- Access the interactive demo at: /demo/qr

### Testing with Demo

- Navigate to /demo/qr

The demo provides controls for:

- Contract Address: Pre-filled with test escrow contract
- Network: Toggle between testnet/mainnet
- Asset: Select USDC, EURC, or XLM
- Amount: Enter any value
- Encoding Mode:
  - auto - Smart selection with fallback
  - plain - Address only (always works)
  - sep7-suggest - Standard Stellar URI
  - freighter-intent - Soroban transaction XDR
  - lobstr-hint - Experimental deep links
- QR Size: 100-400 pixels
- Caption: Toggle address/amount display

## Encoding Strategies

| Strategy         | Format                | Status                 | Notes                                                                                                              |
| ---------------- | --------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Plain            | Address only          | ✅ Works               | Universal fallback, copy-paste                                                                                     |
| SEP-7            | `web+stellar:pay?...` | ⚠️ Blocked             | Requires classic issuer addresses                                                                                  |
| Freighter Intent | Transaction XDR       | ⚠️ Blocked             | Requires Soroban contract addresses                                                                                |
| Lobstr Hint      | `lobstr://send?...`   | ⚠️ Untested            | Lobstr Wallet does not have it own payload format                                                                  |
| Auto             | Best available        | ✅ Falls back to plain | Tries each strategy in order. Falls back incase of errors in params - Not when wallet doesnt recognise the QR code |

## Why QR Scanning Tests Failed

The current trustlines.constant.ts configuration has mixed address types:

```typescript// Current (incorrect) configuration:
{
  name: "USDC",
  address: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA", //  Contract address that should be used
  // SEP-7 needs: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5" // Classic issuer used instead in trustless work dapp
}
```

## Impact

- **SEP-7**: Expects classic asset issuers (G...) but gets contract addresses (C...)
- **Freighter Intent**: Expects contract addresses but EURC uses classic address
- **Result**: Auto mode falls back to plain address for all non-XLM assets

## Testing When Fixed

Once trustlines are corrected:

### Mobile Wallet Testing

**Freighter Mobile:**

1. Open app → Open the asset (USDC) → Click on send → Scan QR icon
2. Scan QR in auto/freighter-intent mode
3. Should open transaction preview

**Lobstr:**

1. Open app → Send → Scan QR
2. Scan QR in auto/sep7-suggest mode
3. Should populate payment fields

**Fallback (All Wallets):**

1. Scan plain mode QR
2. Copy address from wallet
3. Paste in "Send to Contract" flow

## Known Limitations

1. **Asset Configuration Issue**: Trustlines mix Soroban contracts with classic issuers
2. **Missing Issuer**: Component auto-fetches issuer from trustlines, but missmatch is issuer.

## Component Props

| Prop            | Type                     | Required | Description                           |
| --------------- | ------------------------ | -------- | ------------------------------------- |
| `escrowAddress` | `string`                 | Yes      | Soroban contract address (C...)       |
| `network`       | `"testnet" \| "mainnet"` | Yes      | Stellar network                       |
| `assetCode`     | `string`                 | No       | Asset to deposit (e.g., "USDC")       |
| `amount`        | `string`                 | No       | Amount in human units                 |
| `encoding`      | `EncodingStrategy`       | No       | QR encoding mode (default: "auto")    |
| `size`          | `number`                 | No       | QR size in pixels (default: 220)      |
| `caption`       | `boolean`                | No       | Show details below QR (default: true) |

## Files Structure

```
src/
├── lib/qr/
│   ├── qr.ts              # Main payload generator with auto-issuer lookup
│   ├── sep7.ts            # SEP-7 URI format
│   ├── sorban-intent.ts   # Freighter XDR format
│   ├── lobstr-hint.ts     # Lobstr deep links
│   └── validations.ts     # Address/amount validators
├── shared/qr/
│   └── QREscrowDeposit.tsx # React component
└── app/demo/qr/
    └── page.tsx           #Interactive demo
```

## Next Steps

Update trustlines.constant.ts with separate fields:

```typescript
{
  contractAddress: "C...",  // For Soroban operations
  classicIssuer: "G...",    // For SEP-7 payments
}
```

Test with real mobile wallets once data is corrected

## Notes

- Plain mode always works as a fallback (scan → copy → paste)
- Auto mode ensures QR is always scannable, even if advanced features fail
- Component validates contract addresses and amounts for safety
