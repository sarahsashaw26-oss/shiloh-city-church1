# Shiloh City Church Frontend

React frontend for the Shiloh City Church app. It lets members register and log in, and lets first-time visitors record their visit.

## Tech stack

- React 19
- Vite
- Connects to the Express backend in `../backend`

## Getting started

The backend must be running first. See `backend/README.md` or start it with `node src/server.js` from the `backend` folder.

Then, from this folder:

```bash
npm install
npm run dev
```

Open the address Vite prints, usually `http://localhost:5173`.

## Pages

- **Register:** create a member account
- **Log in:** sign in as a member
- **Visitor:** record a first-time visitor

## Project structure

```
src/
├── api.js                    # Shared fetch helper for calling the backend
├── App.jsx                   # Page layout and tab navigation
└── components/
    ├── MemberRegister.jsx    # Registration form
    ├── MemberLogin.jsx       # Login form
    └── VisitorForm.jsx       # First-time visitor form
```

## Scripts

- `npm run dev`: start the development server
- `npm run build`: build for production
- `npm run preview`: preview the production build
- `npm run lint`: check the code with ESLint
