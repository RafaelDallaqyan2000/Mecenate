# Mecenate

Expo + React Native (TypeScript).

## Запуск

```bash
npm install
npx expo start
```

Дальше: **a** — Android, **i** — iOS, **w** — web, или QR в Expo Go.

Сборки: `npm run android` / `npm run ios`.

## Переменные окружения

Создай файл `.env` в корне (можно скопировать из `.env.example`). Expo подхватывает только переменные с префиксом **`EXPO_PUBLIC_`** — после изменения `.env` перезапусти `npx expo start`.

| Переменная | Назначение |
|------------|------------|
| `EXPO_PUBLIC_API_BASE_URL` | Базовый URL API (без завершающего `/`) |
| `EXPO_PUBLIC_API_USER_ID` | UUID для заголовка `Authorization: Bearer …` |

Если переменные не заданы, используются значения по умолчанию из `constants/apiConfig.ts`.
