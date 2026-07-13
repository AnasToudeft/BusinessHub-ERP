# BusinessHub ERP — Frontend

React single-page application for BusinessHub ERP, built with Vite.

## Requirements
- Node.js 18+
- npm

## Setup
```bash
npm install
```

## Running
```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Structure
```
src/
├── assets/       # Images, fonts, static assets
├── components/   # Reusable UI (Sidebar, Topbar, PageContainer, Loading, ...)
├── contexts/     # React contexts (ThemeContext)
├── hooks/        # Custom hooks
├── layouts/      # MainLayout (sidebar + top bar shell)
├── pages/        # Route pages (Dashboard, Placeholder, NotFound)
├── services/     # API layer (Axios)
├── styles/       # Global styles & design tokens
├── App.jsx       # Route definitions
└── main.jsx      # App entry point
```

## Application Shell
The UI is a reusable shell — no business modules yet:

- **Layout**: `MainLayout` composes a fixed `Sidebar` and `Topbar` around the
  routed content (`react-router` `<Outlet/>`). The sidebar collapses into a
  drawer on mobile.
- **Routing**: `Dashboard` at `/`, placeholder sections for future modules, and
  a catch-all `NotFound` (404).
- **Reusable components**: `PageContainer`, `Loading`, `ErrorMessage`,
  `Button`, `FormField`, `AuthCard`.
- **Theming**: light/dark themes built on CSS variables in
  `styles/global.css`. `ThemeContext` persists the choice to `localStorage` and
  honors the OS preference; an inline script in `index.html` prevents a flash of
  the wrong theme on load.

## Authentication
JWT-based session on top of the backend auth API:

- **`AuthContext`** holds the session (`user`, `roles`, `permissions`, `status`)
  and exposes `login` / `register` / `logout`. On load it restores the session
  from the stored token via `GET /api/auth/me`.
- **`services/api.js`** attaches the `Bearer` token to every request and, on a
  `401`, clears the token and ends the session.
- **Route guards**: `ProtectedRoute` gates the app (redirects to `/login`);
  `PublicOnlyRoute` keeps signed-in users out of `/login` and `/register`.
- **Pages**: `Login` and `Register`; the `Topbar` shows the current user and a
  sign-out button.

The token is stored in `localStorage` (`businesshub-token`).

## Tech
- React + React Router
- Axios (API calls)
- CSS Modules
- Responsive design
- Light / dark theming via CSS variables

## Configuration
The API base URL can be set with `VITE_API_URL` (defaults to
`http://localhost:5000/api`).
