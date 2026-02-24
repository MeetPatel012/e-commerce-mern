# Frontend

React + TypeScript + Vite. Product catalog and cart.

## Setup

```bash
npm install
```

`.env` (optional, defaults work with Vite proxy):

```
VITE_API_URL=/api
```

For production, set `VITE_API_URL` to your backend URL (e.g. `https://api.example.com/api`).

## Run

Start the backend first, then:

```bash
npm run dev
```

Runs on http://localhost:5173. API calls are proxied to `localhost:5000` in dev.
