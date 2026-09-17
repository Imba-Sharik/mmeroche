# CLAUDE.md

## Проект

Лендинг «Mmeroche». Стек и архитектура повторяют фронт «Недвижки»
(`D:\nedvizka\apps\frontend`) — при сомнениях смотреть, как сделано там.

## Стек

| Слой | Технология |
|------|-----------|
| Фреймворк | Next.js 16 (App Router, React 19) |
| UI | shadcn/ui (base-ui + radix-ui) + Tailwind CSS v4 |
| Анимации | GSAP |
| Плавный скролл | Lenis (`shared/ui/smooth-scroll.tsx`) |
| Карусели | Embla |
| Тема | next-themes (light/dark, без system) |
| Тосты | sonner |
| Package manager | npm |

Бэкенда нет. Если появится — берём схему недвижки: Strapi 5 в `apps/backend`,
типы генерим Kubb 4 из OpenAPI в `shared/api/generated`, корень переводим
на npm workspaces.

## Структура (FSD)

```
mmeroche/
└── src/
    ├── app/        # App Router: layout, page, globals.css, route handlers
    ├── widgets/    # Секции страницы (Hero, Legend, Kitchen, ... , SiteHeader, SiteFooter)
    ├── features/   # Пользовательские сценарии (бронь, форма)
    ├── entities/   # Доменные сущности + фетчеры
    └── shared/     # ui, lib, config, fonts, types, api
```

Правила слоёв:
- Импорт только вниз: `app → widgets → features → entities → shared`.
- Каждый слайс — папка с `index.ts` на публичный API и `ui/` (+ `model/` при
  необходимости). Наружу импортируем только через `index.ts`: `@/widgets/Hero`,
  не `@/widgets/Hero/ui/Hero`.
- Виджеты называем PascalCase (`SiteHeader`), файлы в `shared/ui` — kebab-case
  (`theme-provider.tsx`), как требует shadcn CLI.
- `cn()` из `@/shared/lib/utils`, алиасы shadcn прописаны в `components.json`.

## Дизайн

Макет: Figma `NtRplGCPBVHvRunlBe4T0u` (Mmeroche), фрейм `114:2367` → `main`
1920×14415. Секции по порядку: Hero `114:2371`, Legend `114:2414`,
Kitchen `114:2427`, Spaces `114:2457`, Interior `114:2483`, Story `114:2511`,
Events `114:2549`, Contacts `114:2576`.

Сетка макета продублирована дважды и должна меняться синхронно:
CSS-переменные в `app/globals.css` (`--container-inset`, `--grid-gap`) и
константы в `shared/config/grid.ts`.

Цветовые токены в `globals.css` пока нейтральные — заменить на реальные из Figma.
Шрифты в `shared/fonts/index.ts` — временно Onest; реальные класть в
`shared/fonts/<family>/*.woff2` и подключать через `next/font/local`, не трогая
имена переменных `--font-display` / `--font-ui`.

## Команды

```bash
npm run dev     # localhost:3000
npm run build
npm run lint
```
