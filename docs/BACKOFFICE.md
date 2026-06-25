# Trustless Work Backoffice — Product Context

## What Is It?

**Trustless Work Backoffice** is the operational console for **Trustless Work**, an **Escrow-as-a-Service (EaaS)** platform built on **Stellar / Soroban**. It enables teams and platforms to manage conditional payments with milestones, approvals, and dispute resolution — without custodial control of funds or writing custom smart contracts.

The backoffice centralizes day-to-day operations: creating and monitoring escrows, executing lifecycle actions, managing API integrations, and coordinating team work under a single account.

---

## Who Is It For?

- **Platforms** integrating Trustless Work into their product (marketplaces, SaaS, grants, freelancing).
- **Operations teams** that need visibility into active escrows, disputes, and metrics.
- **Developers** consuming the REST API or the `@trustless-work/escrow` and `@trustless-work/blocks` packages.
- **On-chain participants** (approvers, service providers, release signers, etc.) who sign transactions from their Stellar wallet.

---

## Authentication & Access

- Access via **Stellar wallet** (no traditional email/password).
- Support for **mainnet** and **testnet**, with network switching from the UI.
- Configurable user profile (personal details, preferences, profile image).
- Public profile linked to the wallet address.

---

## Organizations

**Organizations** group users, escrows, and integration resources under a shared workspace.

- Create and manage organizations with name, settings, and members.
- Invite collaborators with defined roles (admin, operator, read-only, etc.).
- Associate escrows, API keys, and webhooks with an organization.
- Separate work environments (e.g., different teams or clients) without mixing operational data.

---

## Escrows

### Types

| Type               | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| **Single-Release** | Multiple milestones, one payout at the end when all are approved. |
| **Multi-Release**  | Multiple milestones, each with its own independent payout.        |

### Roles Involved

Each escrow assigns Stellar addresses to specific roles: issuer, funder, service provider, approver, release signer, receiver, platform address, dispute resolver, and observer. No single actor controls the full fund flow on their own.

### Escrow Lifecycle

The backoffice supports end-to-end operation across all lifecycle phases:

1. **Initiation** — Deploy the contract with roles, milestones, asset, and fees.
2. **Funding** — Deposit capital into the escrow (requires a trustline for the asset).
3. **Milestone updates** — The service provider reports the status of each milestone.
4. **Approval** — The approver validates completed work (irreversible on-chain).
5. **Release** — The release signer executes payout once conditions are met.
6. **Dispute & resolution** — Involved parties can raise disputes; the dispute resolver arbitrates and reroutes funds.

### In-App Management

- **Create escrows** through a two-step wizard (type + configuration).
- **List and filter** escrows by role, status, amount, dates, and metadata.
- **Execute actions** based on the connected user's role: fund, approve, release, dispute, resolve, update metadata, etc.
- **View details** for each escrow: general info, entities, milestones, and a link to the on-chain viewer.
- **Export** listings to PDF for operational reporting.

---

## Dashboard & Analytics

Central panel with aggregated metrics for the user's or organization's ecosystem:

- Net volume, platform fees, pending funds, and escrows in dispute.
- Distribution by status (active, released, resolved, in dispute).
- Volume and release trends.
- Milestone view: approved but not yet released, approval rates.
- Dispute analytics: rate, average resolution time, pending cases.

---

## API Keys

Key management for integrating Trustless Work from your own backends or frontends.

- **Request** new API keys with defined permissions (e.g., `ESCROW_MANAGER`).
- **List** active keys with ID, roles, creation date, last used, and expiration.
- **Revoke** keys that are no longer needed.
- Switch between **mainnet** and **testnet** when working with the API.
- Keys are shown only once on creation; users must store them securely.

API keys are associated with the user profile or an organization, depending on the work context.

---

## Webhooks

**Webhooks** deliver real-time notifications when relevant events occur on escrows.

- Configure HTTPS endpoints to receive event payloads (creation, funding, approval, release, dispute, resolution, etc.).
- Associate webhooks with an organization or specific escrows.
- Enable, disable, and rotate signing secrets to verify event authenticity.
- Review delivery history and failed retries.

Ideal for syncing escrow state with internal systems (CRM, ERP, end-user notifications) without constant API polling.

---

## Notifications

- Real-time notification center within the backoffice.
- Alerts for relevant escrow activity and account operations.

---

## Resources & Support

- Links to official documentation, demos, UI blocks, and Stellar explorers.
- Help section with FAQs, tutorial videos, and role explanations.
- Interactive walkthrough for new users.
- External on-chain escrow viewer.

---

## Tech Stack (Reference)

| Layer          | Technology                                                      |
| -------------- | --------------------------------------------------------------- |
| Frontend       | Next.js (App Router), React, Tailwind CSS, shadcn/ui            |
| State          | Zustand, TanStack Query                                         |
| Blockchain     | Stellar SDK, `@trustless-work/escrow`, `@trustless-work/blocks` |
| Authentication | Stellar Wallets Kit                                             |
| Backend        | Trustless Work API via server-side proxy                        |

---

## Trustless Work Ecosystem Integration

The backoffice is the operational entry point; technical integration extends to:

- **REST API** — Endpoints for all lifecycle operations.
- **SDK** (`@trustless-work/escrow`) — React/Next.js hooks that wrap the API.
- **Blocks** (`@trustless-work/blocks`) — Pre-built UI components (forms, tables, action dialogs).

Full documentation: [docs.trustlesswork.com](https://docs.trustlesswork.com/trustless-work)

---

## Summary

Trustless Work Backoffice is the hub where teams **create and operate escrows**, **monitor metrics**, **manage organizations and collaborators**, **handle API keys and webhooks**, and **run the full lifecycle** of conditional payments on Stellar — all from a unified, wallet-connected interface.
