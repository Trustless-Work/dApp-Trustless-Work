# Folder Structure

.
├── README.md
├── components.json
├── docs
│   ├── CONTRIBUTORS_GUIDELINE.md
│   ├── Error_Report.xlsx
│   └── GIT_GUIDELINE.md
├── firebase.ts
├── instructions
│   ├── folder_structure.md
│   └── instructions.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── assets
│   │   ├── social-networks
│   │   │   ├── linkedin.svg
│   │   │   ├── telegram.svg
│   │   │   └── x.svg
│   │   └── stellar-expert-blue.svg
│   └── logo.png
├── src
│   ├── @types
│   │   ├── dates.entity.ts
│   │   ├── escrow.entity.ts
│   │   ├── issue.entity.ts
│   │   └── user.entity.ts
│   ├── app
│   │   ├── dashboard
│   │   │   ├── contact
│   │   │   │   └── page.tsx
│   │   │   ├── escrow
│   │   │   │   ├── initialize-escrow
│   │   │   │   └── my-escrows
│   │   │   ├── help
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── report-issue
│   │   │       └── page.tsx
│   │   ├── favicon.ico
│   │   ├── fonts
│   │   │   ├── Exo2.ttf
│   │   │   ├── GeistMonoVF.woff
│   │   │   ├── GeistVF.woff
│   │   │   └── SpaceGrotesk.ttf
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── report-issue
│   │   │   └── page.tsx
│   │   └── settings
│   │       └── page.tsx
│   ├── components
│   │   ├── layout
│   │   │   ├── Bounded.tsx
│   │   │   ├── Wrappers.tsx
│   │   │   ├── footer
│   │   │   │   └── Footer.tsx
│   │   │   ├── header
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── HeaderWithoutAuth.tsx
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   └── hooks
│   │   │   └── sidebar
│   │   │       ├── app-sidebar.tsx
│   │   │       ├── constants
│   │   │       ├── nav-main.tsx
│   │   │       ├── nav-projects.tsx
│   │   │       ├── nav-user.tsx
│   │   │       └── team-switcher.tsx
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── server
│   │   │   │   └── wallet
│   │   │   ├── contact
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── hooks
│   │   │   │   └── schema
│   │   │   ├── dashboard
│   │   │   │   ├── hooks
│   │   │   │   └── ui
│   │   │   ├── escrow
│   │   │   │   ├── code
│   │   │   │   ├── constants
│   │   │   │   ├── hooks
│   │   │   │   ├── schema
│   │   │   │   ├── server
│   │   │   │   ├── services
│   │   │   │   ├── store
│   │   │   │   └── ui
│   │   │   ├── help
│   │   │   │   ├── constants
│   │   │   │   └── ui
│   │   │   ├── report-issue
│   │   │   │   ├── hooks
│   │   │   │   ├── schema
│   │   │   │   ├── server
│   │   │   │   └── ui
│   │   │   └── setting
│   │   │       ├── APIKeysSection.tsx
│   │   │       ├── Settings.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       ├── appearanceSection.tsx
│   │   │       ├── hooks
│   │   │       ├── preferencesSection.tsx
│   │   │       ├── profileSection.tsx
│   │   │       ├── server
│   │   │       ├── services
│   │   │       ├── store
│   │   │       └── ui
│   │   ├── ui
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calender.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── steps.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── tab.tsx
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── tooltip.tsx
│   │   └── utils
│   │       ├── code
│   │       │   ├── CodeBlock.tsx
│   │       │   └── FlipCard.tsx
│   │       └── ui
│   │           ├── Create.tsx
│   │           ├── Divider.tsx
│   │           ├── Loader.tsx
│   │           ├── NoData.tsx
│   │           ├── SelectSearch.tsx
│   │           └── Tooltip.tsx
│   ├── core
│   │   ├── config
│   │   │   ├── axios
│   │   │   │   └── http.ts
│   │   │   └── firebase
│   │   │       └── firebase.ts
│   │   └── store
│   │       ├── data
│   │       │   ├── @types
│   │       │   ├── index.ts
│   │       │   └── slices
│   │       └── ui
│   │           ├── @types
│   │           ├── index.ts
│   │           └── slices
│   ├── hooks
│   │   ├── layout-dashboard.hook.ts
│   │   ├── mobile.hook.ts
│   │   └── toast.hook.ts
│   ├── lib
│   │   └── utils.ts
│   └── utils
│       └── hook
│           ├── copy.hook.ts
│           ├── format.hook.ts
│           ├── input-visibility.hook.ts
│           └── valid-data.hook.ts
├── tailwind.config.ts
└── tsconfig.json


