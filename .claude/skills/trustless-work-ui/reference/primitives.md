# Primitives — Trustless Work dApp

> **Canonical:** [`docs/DESIGN_SYSTEM.md`](../../../../docs/DESIGN_SYSTEM.md) (§9). This file is a quick extract for agents; update the canonical doc when CVA patterns change.

Exact patterns from `src/components/ui/`. Prefer variants over `className` color overrides.

`cn` = `clsx` + `tailwind-merge` at `@/lib/utils`.

---

## Button (`button.tsx`)

**Base (abbrev):** `inline-flex … rounded-4xl … text-sm font-medium … focus-visible:ring-3 focus-visible:ring-ring/30 … [&_svg:not([class*='size-'])]:size-4 cursor-pointer`

| Variant | Classes |
| --- | --- |
| `default` | `bg-primary text-primary-foreground hover:bg-primary/80` |
| `outline` | `border-border bg-background hover:bg-muted … dark:bg-transparent dark:hover:bg-input/30` |
| `secondary` | `bg-secondary text-secondary-foreground` + color-mix hover |
| `ghost` | `hover:bg-muted … dark:hover:bg-muted/50` |
| `destructive` | `bg-destructive/10 text-destructive hover:bg-destructive/20` (+ dark `/20` `/30`) |
| `link` | `text-primary underline-offset-4 hover:underline` |

| Size | Classes |
| --- | --- |
| `default` | `h-9 gap-1.5 px-3` |
| `xs` | `h-6 gap-1 px-2.5 text-xs` · svg `size-3` |
| `sm` | `h-8 gap-1 px-3` |
| `lg` | `h-10 gap-1.5 px-4` |
| `icon` | `size-9` |
| `icon-xs` | `size-6` · svg `size-3` |
| `icon-sm` | `size-8` |
| `icon-lg` | `size-10` |

Icons: `data-icon="inline-start"` | `inline-end`. Default icon **`size-4`**.

Header CTAs in product: prefer `size="sm"`.

---

## Input / Textarea / Select

### Input

```
h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1
text-base md:text-sm
placeholder:text-muted-foreground
focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
dark:bg-input/30
```

### Textarea

Same border/focus/dark as Input; `min-h-16 px-2.5 py-2` · `field-sizing-content`.

### SelectTrigger

```
rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm
data-[size=default]:h-8 data-[size=sm]:h-7
dark:bg-input/30
```

### SelectContent

`rounded-lg bg-popover shadow-md ring-1 ring-foreground/10` · animate fade/zoom.

### SelectItem

`rounded-md py-1 pr-8 pl-1.5 text-sm gap-1.5 focus:bg-accent`.

### InputGroup

Shell mirrors Input: `h-8 rounded-lg border-input` + focus ring on control focus.

### InputOTPSlot

`size-8` · first/last `rounded-l/r-lg` · active `ring-3 ring-ring/50`.

---

## Card

```
flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl
bg-card/20 py-(--card-spacing) text-sm text-card-foreground
ring-1 ring-foreground/10
[--card-spacing:--spacing(4)]
data-[size=sm]:[--card-spacing:--spacing(3)]
```

**No default box-shadow** — edge via ring.

| Part | Key classes |
| --- | --- |
| Header | `gap-1 rounded-t-xl px-(--card-spacing)` |
| Title | `font-heading text-lg leading-snug font-bold` · sm size → `text-base` |
| Description | `text-sm text-muted-foreground` |
| Content | `px-(--card-spacing)` |
| Footer | `border-t bg-muted/50 p-(--card-spacing) rounded-b-xl` |

House note: escrow grid often uses custom `article` + `rounded-3xl` instead of Card — settings/orgs use Card. Stay consistent **within** a list surface.

---

## Badge

```
inline-flex h-5 … gap-1 rounded-4xl border-transparent px-2 py-0.5 text-xs font-medium
[&>svg]:size-3!
```

Variants: `default` | `secondary` | `destructive` (`bg-destructive/10`) | `outline` | `ghost` | `link`.

No size variants. Status mapping → SKILL.md / composition.md.

---

## Dialog / AlertDialog / Sheet / Drawer

### Overlay

```
fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs
duration-100 animate-in fade-in-0
```

### DialogContent

```
max-w-[calc(100%-2rem)] sm:max-w-sm rounded-xl bg-popover p-4 text-sm gap-4
ring-1 ring-foreground/10 zoom-in-95
```

- Title: `font-heading text-base font-medium`
- Description: `text-sm text-muted-foreground`
- Footer: `-mx-4 -mb-4 border-t bg-muted/50 p-4` · `flex-col-reverse sm:flex-row sm:justify-end`
- Close: `Button ghost icon-sm` absolute `top-2 right-2`

Wide create flows may override `sm:max-w-4xl lg:max-w-5xl` + `max-h-[92vh]` — exception for multi-step only.

### AlertDialogContent

`rounded-xl p-4 gap-4 ring-1 ring-foreground/10` · `max-w-xs` / `sm:max-w-sm`.

### SheetContent

`w-3/4 sm:max-w-sm shadow-lg gap-4 bg-popover` · slide duration-200 · header/footer `p-4`.

### Drawer (vaul)

Bottom/top: `max-h-[80vh] rounded-t/b-xl` · handle `h-1 w-[100px] rounded-full bg-muted`.

---

## Table

| Part | Classes |
| --- | --- |
| Table | `w-full caption-bottom text-sm` in overflow wrapper |
| Head | `h-10 px-2 font-medium text-foreground` |
| Cell | `p-2 align-middle whitespace-nowrap` |
| Row | `border-b hover:bg-muted/50 data-[state=selected]:bg-muted` |
| Footer | `border-t bg-muted/50 font-medium` |

---

## Tabs / Toggle / Switch / Checkbox / Radio

### Tabs

- List default: `rounded-lg p-[3px] bg-muted h-8`
- Trigger: `rounded-md px-1.5 py-0.5 text-sm font-medium` · active `data-active:bg-card shadow-sm`

### RoundedTabs (`custom-tab.tsx`) — house segmented control

```
rounded-full border border-border bg-muted/60 p-1 gap-1
indicator: rounded-full bg-card shadow-sm ring-1 ring-border
tab: rounded-full px-4 py-2 text-sm font-medium [&_svg]:size-4
```

### Toggle

`rounded-lg text-sm` · default `h-8` · sm `h-7` · lg `h-9` · on: `data-[state=on]:bg-muted`.

### Switch

| Size | Track | Thumb |
| --- | --- | --- |
| default | `h-[18.4px] w-[32px]` | `size-4` |
| sm | `h-[14px] w-[24px]` | `size-3` |

Checked `bg-primary` · unchecked `bg-input` · `rounded-full`.

### Checkbox

`size-4 rounded-[4px] border-input` · checked `border-primary bg-primary` · indicator svg `size-3.5`.

### Radio

`size-4 rounded-full` · indicator `size-2 bg-primary-foreground` · group `gap-2`.

---

## Separator / Skeleton / Avatar

| Component | Classes |
| --- | --- |
| Separator | `bg-border` · horizontal `h-px w-full` |
| Skeleton | `animate-pulse rounded-md bg-muted` |
| Avatar | default `size-8 rounded-full` · sm `size-6` · lg `size-10` |
| AvatarFallback | `bg-muted text-sm` |

`UserAvatar` often overrides to **`rounded-lg`** (square-ish) — intentional for profile chrome.

---

## Sidebar

| Constant | Value |
| --- | --- |
| Width | `16rem` |
| Mobile | `18rem` |
| Icon mode | `3rem` |

- Menu button: `h-8` · `rounded-md p-2 text-sm` · icons `size-4`
- Inset: `rounded-xl shadow-sm`
- Transition: `duration-200 ease-linear`

---

## Other

| Primitive | Key classes |
| --- | --- |
| Label | `text-sm font-medium leading-none` |
| Alert | `rounded-lg border px-2.5 py-2 text-sm` · svg `size-4` |
| Popover | `w-72 rounded-lg p-2.5 shadow-md ring-1 ring-foreground/10` |
| Tooltip | `rounded-md bg-foreground px-3 py-1.5 text-xs text-background` |
| Dropdown item | `rounded-md px-1.5 py-1 text-sm gap-1.5` |
| Progress | `h-1 rounded-full bg-muted` · indicator `bg-primary` |
| Spinner | `Loader2Icon size-4 animate-spin` |
| Kbd | `h-5 min-w-5 rounded-sm bg-muted px-1 text-xs` |
| Empty (ui) | `rounded-xl border-dashed p-6` · media `size-8 rounded-lg bg-muted` |
| FieldGroup | `gap-5` · Field `gap-2` · FieldSet `gap-4` |
| Breadcrumb | `text-sm text-muted-foreground` · sep svg `size-3.5` |

Product empty lists: prefer shared **`NoData`** (`@/components/shared/NoData`) over ui `Empty` unless already in that pattern.

---

## Forms

App forms use RHF + Zod + `@/components/ui/form` (`FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) — see `FORMS.mdc`.

Field spacing in dialogs: `gap-2` / `gap-3` / grid `gap-4`. Do not invent parallel form layout systems.
