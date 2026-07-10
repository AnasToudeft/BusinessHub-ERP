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
├── components/   # Reusable UI components
├── contexts/     # React contexts (global state)
├── hooks/        # Custom hooks
├── layouts/      # Page layouts
├── pages/        # Route pages
├── services/     # API layer (Axios)
├── styles/       # Global styles
├── App.jsx       # Route definitions
└── main.jsx      # App entry point
```

## Tech
- React + React Router
- Axios (API calls)
- CSS Modules
- Responsive design

## Configuration
The API base URL can be set with `VITE_API_URL` (defaults to
`http://localhost:5000/api`).
