# Tokens — Trustless Work dApp

> **Canonical:** [`docs/DESIGN_SYSTEM.md`](../../../../docs/DESIGN_SYSTEM.md) (§3–8). This file is a quick extract for agents; update the canonical doc when tokens change.

Source: `src/app/globals.css`, `src/app/layout.tsx`, `components.json`.

---

## Stack

| Item | Value |
| --- | --- |
| Tailwind | v4 (`@import "tailwindcss"`, `@theme inline`) |
| shadcn style | `radix-luma` |
| baseColor | `neutral` |
| Dark mode | `class` on `<html>` via `next-themes` · `@custom-variant dark (&:is(.dark *))` |
| Fonts | Space Grotesk → `--font-sans` / `font-heading` · Geist Mono → `--font-geist-mono` |
| Icons | Lucide (`components.json` `iconLibrary`) |

---

## Brand primary scale (hex)

| Token | Value |
| --- | --- |
| `--primary-50` | `#e6f7ff` |
| `--primary-100` | `#bae7ff` |
| `--primary-200` | `#91d5ff` |
| `--primary-300` | `#69c3ff` |
| `--primary-400` | `#40b1ff` |
| `--primary-500` | `#006be4` |
| `--primary-600` | `#0050b3` |
| `--primary-700` | `#0050b3` |
| `--primary-800` | `#003a8c` |
| `--primary-900` | `#00275c` |

- `--primary` = `var(--primary-500)` in light **and** dark
- `--primary-foreground` = `#ffffff`
- `--ring` = `var(--primary-500)`
- Tailwind: `bg-primary`, `text-primary`, `bg-primary-50`…`bg-primary-900`, `hover:bg-primary/80`

---

## Semantic tokens (oklch)

### Light (`:root`)

| Token | Value |
| --- | --- |
| `--background` | `oklch(1 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` |
| `--card` | `oklch(1 0 0)` |
| `--card-foreground` | `oklch(0.145 0 0)` |
| `--popover` | `oklch(1 0 0)` |
| `--popover-foreground` | `oklch(0.145 0 0)` |
| `--secondary` / `--muted` / `--accent` | `oklch(0.97 0 0)` |
| `--secondary-foreground` / `--accent-foreground` | `oklch(0.205 0 0)` |
| `--muted-foreground` | `oklch(0.556 0 0)` |
| `--destructive` | `oklch(0.577 0.245 27.325)` |
| `--border` / `--input` | `oklch(0.922 0 0)` |
| `--sidebar` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `var(--primary-500)` |

Charts 1–5: neutral gray scale (same both modes).

### Dark (`.dark`)

| Token | Value |
| --- | --- |
| `--background` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.985 0 0)` |
| `--card` / `--popover` | `oklch(0.205 0 0)` |
| `--secondary` / `--muted` / `--accent` | `oklch(0.269 0 0)` |
| `--muted-foreground` | `oklch(0.708 0 0)` |
| `--destructive` | `oklch(0.704 0.191 22.216)` |
| `--border` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(1 0 0 / 15%)` |
| `--sidebar` | `oklch(0.205 0 0)` |

Surfaces often use opacity: `dark:bg-input/30`, `bg-card/20`, `bg-card/40`.

---

## Radius scale

```css
--radius: 0.625rem; /* 10px */
--radius-sm: calc(var(--radius) * 0.6);
--radius-md: calc(var(--radius) * 0.8);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) * 1.4);
--radius-2xl: calc(var(--radius) * 1.8);
--radius-3xl: calc(var(--radius) * 2.2);
--radius-4xl: calc(var(--radius) * 2.6);
```

| Tailwind | Typical use |
| --- | --- |
| `rounded-4xl` | Button, Badge, filter pills |
| `rounded-xl` | Card, Dialog, Drawer, Empty, inset sidebar |
| `rounded-lg` | Input, Select, Tabs list, menus, Alert |
| `rounded-md` | Menu items, Skeleton, tab triggers |
| `rounded-2xl` | Container, nested tiles |
| `rounded-3xl` | Escrow panels / cards (house) |
| `rounded-full` | Switch, Avatar, Progress, status dots |
| `rounded-[4px]` | Checkbox only |

---

## Focus / invalid

Ubiquitous pattern:

```
focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
```

- Buttons use `ring-ring/30`
- Invalid: `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20` (+ dark `/50`, `/40`)
- Base: `* { @apply border-border outline-ring/50; }`

---

## Elevation policy

| Pattern | When |
| --- | --- |
| `ring-1 ring-foreground/10` | Cards, dialogs, popovers, menus — **preferred** soft edge |
| `shadow-sm` | Container, active tab, inset/floating sidebar, RoundedTabs indicator, escrow card rest |
| `shadow-md` | Select / Popover / Dropdown content |
| `shadow-lg` | Sheet; escrow card **hover** only — not default card chrome |
| Tooltip | Filled `bg-foreground` — no shadow |

---

## Typography tokens

| Role | Classes |
| --- | --- |
| Body | `font-sans` (Space Grotesk), `antialiased` |
| Headings in primitives | `font-heading` (= sans) |
| Mono | `font-mono` (Geist Mono) |
| Default UI density | `text-sm` |
| Micro | `text-xs` (Badge, Kbd, labels) |
| Inputs mobile | `text-base` → `md:text-sm` |
| Muted copy | `text-muted-foreground` |

Page hierarchy (house — see composition.md):

- H1: `text-2xl font-semibold tracking-tight md:text-3xl`
- Section H2: `text-lg font-semibold tracking-tight`
- Card list title: `text-base font-semibold`

Weights: controls `font-medium`; CardTitle `font-bold`; page headers `font-semibold`.

---

## Global chrome

### Scrollbar

- Width/height `6px`
- Thumb: `color-mix(in oklch, var(--muted-foreground) 28%, transparent)` · hover `45%`
- Utility `.scrollbar-hide` for tabs

### Sonner

- Toast icon well `1.75rem`
- Close button `2rem` rounded-full
- Escrow tx toast: `max-width: min(calc(100vw - 2rem), 24rem)`

### Motion extras

- Theme toggle: View Transitions API (`data-magicui-theme-vt`)
- Cursor blink: `--animate-blink-cursor`
- 3D helpers: `.perspective-1000`, `.backface-hidden`, `.rotate-y-180`

---

## Do / Don’t

**Do**

- Use semantic Tailwind colors mapped to CSS vars
- Keep brand blue stable across themes
- Prefer ring edges over heavy shadows
- Match focus-ring pattern when building custom controls

**Don’t**

- Hardcode `#006be4` in feature classNames when `bg-primary` works
- Add new chart hues or status greens as CSS vars without product decision
- Use `dark:bg-gray-*` / `dark:text-slate-*` for product chrome
- Copy marketing raw palettes into dashboard
