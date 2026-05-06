# Mecenate

Expo + React Native mobile social/content platform (patron/creator monetization). This repo is the **client only** — the backend API is external.

## Cursor Cloud specific instructions

### Services

| Service | How to run | Notes |
|---------|-----------|-------|
| Expo Web Dev Server | `npx expo start --web --port 8081` | Serves the app at `http://localhost:8081`. Use web mode for headless testing. |

### Quick reference

- **Package manager:** npm (`package-lock.json`)
- **Lint:** `npm run lint` (runs `expo lint`)
- **Start dev server:** `npx expo start` (press `w` for web)
- **Environment:** Copy `.env.example` to `.env` — defaults are hardcoded in `constants/apiConfig.ts` if `.env` is absent.

### Gotchas

- The backend REST API at `https://k8s.mectest.ru/test-app` is external — no local DB or server setup needed.
- Auth is a static UUID sent as `Authorization: Bearer <UUID>` header; the default UUID in `.env.example` works.
- After changing `.env`, the Metro bundler must be restarted for changes to take effect.
- WebSocket URL (`EXPO_PUBLIC_WS_URL`) is auto-derived from the API URL if left empty.
- Expo SDK 54 with React Native 0.81 and React 19 — ensure Node.js 22+ is available.
