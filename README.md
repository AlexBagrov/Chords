# Chords

Личный офлайн-сборник песен с аккордами (PWA). План — в [PLAN.md](./PLAN.md).

## Требования

- Node.js 22+ (LTS)

## Команды

```bash
npm install
npm run dev      # разработка (без Service Worker)
npm run build    # production-сборка + PWA
npm run preview  # проверка сборки и офлайна
npm test         # тесты
npm run lint     # ESLint
```

После `npm run dev` открой адрес, который покажет Vite (обычно http://localhost:5173).

## Добавить песню

Краткий чеклист и шаблон: [songs/README.md](./songs/README.md), файл `songs/templates/template.chordpro`.

## GitHub Pages

После push в `main` Action **Deploy to GitHub Pages** публикует сайт:

**https://alexpoprov.github.io/Chords/**

Один раз в настройках репо: **Settings → Pages → Source: GitHub Actions**.

### На компьютере (локально)

1. `npm run build && npm run preview`
2. Chrome → при желании «Установить»
3. Офлайн: DevTools → Network → Offline

### На Android (рекомендуется через Pages)

1. Открой https://alexpoprov.github.io/Chords/ в Chrome
2. Меню → **Установить приложение** / **На главный экран**
3. Открой ярлык без сети — песни уже в кэше

После добавления песен: push в `main` → подожди Action → на телефоне один раз открой сайт онлайн (обновится кэш).

`npm run dev` Service Worker не включает.