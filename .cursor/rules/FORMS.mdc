---
description: forms
alwaysApply: true
---

# Layered form architecture

This document describes a **stack of responsibilities** for structuring forms in component-based frontends (e.g. React). It is **general**: it states direction and layers, not a specific screen, app package, or on-disk layout.

---

## Purpose

Forms follow **clean separation**: views orchestrate layout and when things appear; components render fields; hooks own state, validation, and submission; services own HTTP or RPC; shared clients and context supply auth and API access.

---

## Layer 1 — View / page

**Role:** Decide **when** the form exists on screen and **where** it sits in the page (grids, tabs, onboarding panels).

**Typical duties:**

- Wait for prerequisites (e.g. authenticated user or loaded domain data) before rendering the form subtree.
- Pass only what the form component needs: flags, refs for focus/highlight, or routing params—not business logic for save/load.

**Does not:** Call REST endpoints directly or embed large form-library setups (those belong in a hook).

---

## Layer 2 — Form component (presentation)

**Role:** **Bind** UI primitives to a form instance provided by a hook.

**Typical duties:**

- Wrap fields with design-system form helpers (`Form`, `FormField`, labels, messages).
- Wire submit to the handler from the hook (e.g. `form.handleSubmit(onSubmit)` with React Hook Form).
- Disable submit while a `loading` (or equivalent) flag from the hook is true.

**Does not:** Encode API URLs, parsing of server errors, or create-vs-update branching—unless the team explicitly keeps a trivial form inline.

---

## Layer 3 — Hook (feature logic)

**Role:** Single place for **everything between the UI and the wire**.

**Typical duties:**

- Create and configure the form library (e.g. React Hook Form) with a schema resolver when validation is schema-driven.
- **Default values** and **sync** from server or context (e.g. reset when fetched data arrives).
- Implement **submit**: map form values to API payloads, call the service, handle success (toasts, cache refresh, reset dirty state) and failure (user-visible messages).
- Expose a small surface: `form`, `onSubmit`, `loading`, and any extra actions the component needs.

**Does not:** Own layout or routing; does not construct raw URLs (delegates to a service).

---

## Layer 4 — Schema (optional but recommended)

**Role:** **Declare** field rules and infer TypeScript types from one source.

**Typical duties:**

- Optional vs required fields, formats (URLs, lengths), arrays, etc.
- Export a type for the form generic when using typed form libraries.

**Relationship:** The hook wires the schema into the form resolver; the component only consumes field names that match the schema.

---

## Layer 5 — Service (HTTP / RPC)

**Role:** **Encapsulate** each backend operation behind named methods.

**Typical duties:**

- Use the shared HTTP (or RPC) client in whatever pattern the repo adopts (singleton import, injected client, etc.).
- One method per use case (`createX`, `updateX`, …) with typed payloads and responses where possible.
- On failure, throw errors that preserve the underlying cause so hooks can read status bodies or messages consistently.

**Does not:** Import UI framework code or call hooks.

---

## Layer 6 — Infrastructure & context

**Role:** Cross-cutting concerns used by hooks and services.

**Includes:**

- **HTTP (or API) client** — base URL, interceptors, auth headers from the app or shared package.
- **User (or session) context** — identity and server-backed user record used for prefill and for knowing **create vs update** when that distinction exists on the backend.
- **Notifications** — toasts for success and failure.

---

## Alternate pattern — minimal forms

When there is **one control** and **no multi-field validation**, a screen may skip the full stack: **local state + a mutation hook** (e.g. TanStack Query `useMutation`) that calls a service or client. The same **service** and transport ideas apply; only the hook and component shrink.

---

## Vertical flow (mental model)

```
Page / View          →  mount timing, layout, data gating
    ↓
Form component       →  fields + submit wiring only
    ↓
Feature hook         →  form config, sync, submit, UX side effects
    ↓
[Schema]             →  validation + types (optional layer)
    ↓
Service              →  HTTP/RPC methods per operation
    ↓
Client + auth context  →  transport and identity
```

---

## Guidelines for new forms

1. Add or extend a **hook** as the integration point; keep the **component** thin.
2. Put validation in a **schema** when more than one field has rules or when types should stay in sync with validation.
3. Add **service methods** instead of inline `POST`/`fetch` inside hooks.
4. Use the **minimal pattern** only when a full form stack adds no clarity.

This keeps forms **consistent**, **testable** at the hook/service boundary, and easy to explain by layer to people and tools.
