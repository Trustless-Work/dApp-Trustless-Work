---
name: trustless-work-ui
description: Enforces Trustless Work dApp visual language (radix-luma, Space Grotesk, brand blue #006be4, house composition). Use when building, restyling, or reviewing any dashboard/feature/settings UI, shadcn composition, cards, dialogs, filters, tables, or empty states. Prefer this over frontend-design for product UI.
---

# Trustless Work UI

Product design system for the dApp. Stay on the existing visual line — do not invent a new aesthetic.

**Rule (always on):** `.cursor/rules/DESIGN_SYSTEM.mdc`  
**Stack:** shadcn `radix-luma` · Tailwind v4 · Space Grotesk · Lucide · tokens in `src/app/globals.css`

---

## When to use

- Building or restyling dashboard, features, settings, dialogs, filters, tables, cards, empty/loading states
- Reviewing PRs for visual consistency
- Composing shadcn primitives for product screens

## When NOT to use

| Context | Use instead |
| --- | --- |
| Marketing / home / landing | Separate visual language — see [composition.md](reference/composition.md)#marketing-exception |
| Creative one-off experiments | `frontend-design` only if user explicitly wants a new aesthetic **outside** product |
| Adding shadcn components via CLI | `shadcn` skill, then style with **this** skill |
| Skeletons / empty / tables policy | Also follow `SKELETONS.mdc` + `DAPP.mdc` |

**Priority for product UI:** `trustless-work-ui` > `frontend-design`.

---

## Workflow

1. **Tokens** — semantic colors, radius map, density → [tokens.md](reference/tokens.md)
2. **Primitive** — pick existing `@/components/ui/*` variant; do not restyle colors → [primitives.md](reference/primitives.md)
3. **Recipe** — copy house composition for the screen type → [composition.md](reference/composition.md)
4. **Checklist** — run review checklist below before finishing

---

## Quick decision tables

### Radius

| Need | Class |
| --- | --- |
| Button / Badge / filter pills | `rounded-4xl` |
| Input / Select / Textarea / Toggle | `rounded-lg` |
| Card / Dialog / Sheet / NoData | `rounded-xl` |
| Container / nested tiles | `rounded-2xl` |
| Escrow panels / escrow cards | `rounded-3xl` |
| Avatar / Switch / dots | `rounded-full` |

### Colors (product)

| Need | Token |
| --- | --- |
| Page bg / text | `bg-background` / `text-foreground` |
| Surface | `bg-card` · border `border-border` |
| Muted copy | `text-muted-foreground` |
| Primary CTA | `bg-primary text-primary-foreground` (`#006be4`) |
| Soft destructive | `bg-destructive/10 text-destructive` |
| Elevated edge | `ring-1 ring-foreground/10` |

**Forbidden in features:** `bg-blue-*`, `text-green-600`, `emerald-*`, `purple-*`, arbitrary hex (except ambient `Lights` chrome).

### Sizes

| Control | Height / size |
| --- | --- |
| Input / Select | `h-8` |
| Button | default `h-9` · `sm` = `h-8` · header CTAs → `size="sm"` |
| Badge | `h-5` `text-xs` |
| Icon default | `size-4` |
| Icon compact | `size-3` / `size-3.5` |
| Page header icon | `size-5 sm:size-6` |

### Badge status mapping

| Status | Variant |
| --- | --- |
| disputed / error | `destructive` |
| released / resolved | `secondary` |
| flags (approved) | `outline` |
| flags (released) | `default` |
| active (product exception) | inverted `bg-foreground text-background` + live dot — do not invent more inverted badges |

### Gaps

- Control internal: `gap-1` / `gap-1.5`
- Sections: `gap-4` / `gap-6`
- FieldGroup: `gap-5`
- Flex/grid siblings: **`gap-*`**, not `space-x`/`space-y` (ok `space-y` for title→description only)

---

## Minimal recipes

```tsx
// Page title
<h1 className="text-pretty text-2xl font-semibold tracking-tight md:text-3xl">…</h1>

// Settings / list shell
<Container>{/* rounded-2xl border bg-card/40 p-6 shadow-sm */}</Container>

// Escrow detail section
<section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
  <h2 className="text-lg font-semibold tracking-tight">…</h2>
</section>

// Dual table
<div className="flex flex-col gap-3 md:hidden">…cards…</div>
<div className="hidden md:block">…Table…</div>

// Empty
<NoData title="No items yet" description="…" />

// Dialog actions
<Button variant="outline">Cancel</Button>
<Button>Save</Button>
```

---

## Review checklist

```
- [ ] Semantic tokens only (no raw palette in product UI)
- [ ] Radius matches map (pill buttons, lg fields, xl cards, 3xl escrow panels)
- [ ] Heights: inputs h-8, buttons h-9 or sm
- [ ] Icons size-4 (or documented exception)
- [ ] Empty → NoData; loading → Skeleton (SKELETONS.mdc)
- [ ] Data tables: dual md cards + desktop table
- [ ] Dialog footer: Cancel outline → primary right
- [ ] Light + dark OK without hard-coded greys
- [ ] No marketing/hero aesthetics in dashboard
- [ ] className used for layout, not recoloring primitives
```

---

## References

- [tokens.md](reference/tokens.md) — CSS variables, brand scale, focus, shadows
- [primitives.md](reference/primitives.md) — exact CVA classes for ui components
- [composition.md](reference/composition.md) — page recipes, anti-patterns, marketing exception
