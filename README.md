# Mmeroche

Лендинг на Next.js 16 (App Router) + Tailwind CSS v4, архитектура FSD.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Открыть http://localhost:3000

## Структура

```
src/
├── app/        # App Router
├── widgets/    # Секции страницы
├── features/   # Пользовательские сценарии
├── entities/   # Доменные сущности
└── shared/     # ui, lib, config, fonts, types
```

Подробнее — в [CLAUDE.md](CLAUDE.md).
