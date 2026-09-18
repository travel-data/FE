# React + Vite

## Local Kakao login

Run the BE with the `local` Spring profile on `http://localhost:8080` and the FE
with `npm run dev` on `http://localhost:5173`. The Vite development proxy sends
API and OAuth requests to the local BE; production Vercel rewrites are unchanged.

Register `http://localhost:8080/login/oauth2/code/kakao` as a Kakao redirect
URI for the local client. Set the local BE's Kakao credentials and database
settings as described in its `.env.example`. Keep `VITE_API_BASE_URL` empty so
requests go through the Vite proxy. If the local BE uses a different port, set
`VITE_DEV_BACKEND_URL` to its origin in `.env.local`. Vite requires port 5173 so
the configured success URL continues to match.

The production BE cannot complete a login started from localhost: its Kakao
callback returns to the deployed FE, which does not have localhost's session
cookie.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
