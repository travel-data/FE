# React + Vite

## Local Kakao login

Run `npm run dev` at `http://localhost:5173`. The Vite development proxy sends
API and OAuth requests to the deployed BE by default; no local BE or DB is
needed. Keep `VITE_API_BASE_URL` empty. Production Vercel rewrites are unchanged.

In Kakao Developers, add this exact redirect URI to the **REST API key** used by
the BE (keep the existing production URI too):

```text
http://localhost:5173/login/oauth2/code/kakao-local
```

The FE uses the BE's separate `kakao-local` registration in development. The
callback returns through Vite, so the OAuth session and auth cookies remain on
localhost. Vite adapts the deployed BE's Secure/SameSite cookies for local HTTP
only; production cookies are unchanged. Since API requests reach the deployed
BE, local changes can affect production data.

`VITE_DEV_BACKEND_URL` may be set in `.env.local` to use another BE, provided it
has the `kakao-local` registration. Vite requires port 5173 so the callback
address matches exactly.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
