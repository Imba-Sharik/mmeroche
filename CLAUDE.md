# CLAUDE.md

## Проект

Лендинг ресторана «Madame Roche» (Москва, ул. Кожевническая, 16 стр. 4);
репозиторий и пакет называются `mmeroche`. Стек и архитектура повторяют фронт
«Недвижки» (`D:\nedvizka\apps\frontend`) — при сомнениях смотреть, как сделано там.

Макет существует только в тёмном виде: `defaultTheme="dark"`, светлая тема —
пустая точка расширения в `globals.css`.

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

### Палитра

Токены из Figma живут в `:root` (`globals.css`), брендовые — `cream` `#F2F1E0`,
`wine` `#761313`, `noir` `#010101`. Текст берём через `ink`-шкалу
(`ink` / `ink-dim` 70% / `ink-muted` 50% / `ink-faint` 30%), а не прозрачностями
по месту.

### Шрифты

`shared/fonts/index.ts`, три семейства:

| Переменная | Шрифт | Где |
|------------|-------|-----|
| `--font-display` | Playfair Display (**временно**) | лого MADAME, заголовки секций |
| `--font-ui` | PT Mono (только 400) | навигация, кнопки, подписи |
| `--font-accent` | Noto Serif SC | иероглифы 秘密之地 / 创意料理 |

Дисплейный шрифт макета — «a RomanusTitul», лицензионных файлов нет. Когда
придут: `shared/fonts/<family>/*.woff2` + `next/font/local`, имена переменных не
трогать, после подмены свериться с Hero — положение логотипа `Roche` считается
в процентах от ширины строки MADAME.

Размеры PT Mono зашиты утилитами `text-mono-xs` / `text-mono-sm` /
`text-mono-base` (12 / 14 / 18px) — макет других не использует.

### Ассеты

Экспорт из Figma кладём в `public/images/<секция>/` (`hero`, `legend`, `kitchen`,
`spaces`, `interior`, `story`, `events`, `contacts`, `common`) и пережимаем в WebP (`sharp` идёт с
Next): исходный фон Hero весил 7 МБ, после конвертации — 344 КБ. Иконки берём из
`lucide-react`, если глиф совпадает с макетом (`ArrowDown`, `Music2`), иначе —
экспортируем SVG. `roche.svg` рендерим через `next/image` с `unoptimized`.

### Анимации

GSAP и Lenis связаны вручную: Lenis крутится из тикера GSAP и на каждый кадр
дёргает `ScrollTrigger.update()` (`shared/ui/smooth-scroll.tsx`). Грабли, на
которые уже наступали:

- Плагин регистрируем **на уровне модуля** (`shared/lib/gsap.ts`), а не в
  эффекте: layout-эффекты детей выполняются раньше `useEffect` соседей, и твин
  со `scrollTrigger` успевал создаться до регистрации — GSAP молча отбрасывал
  привязку и проигрывал анимацию сам по себе.
- Анимации оборачиваем в `useGsapLayout` (`shared/lib/use-gsap-layout.ts`) —
  это `gsap.context`, который откатывает всё на размонтировании.
- На `body` не вешаем `overflow-x-clip`: с ним ломается пин. Вылеты по ширине
  обрезаем в самих блоках, а `w-screen` не используем вовсе — это 100vw вместе
  с полосой прокрутки, отсюда горизонтальный скролл. Полную ширину внутри
  секции даём отрицательными полями плюс `self-stretch`.
- Текст, который выезжает из-под маски, не может иметь `leading` меньше
  единицы: строка окажется ниже глифов и маска срежет буквы.

### Референс

Дизайнер собирал блоки с https://www.fromanother.love/ — Next.js + Lenis +
GSAP/ScrollTrigger. Их приёмы, которые мы повторяем: смена кадров **дискретная**
(прокрутка выбирает этап, анимация играет своим временем `1.4s` `power3.out`),
строки ходят под масками на `yPercent ±150` с разбегом `0.05` и проявляются из
`blur(10px)`, вход секции — `start: "top bottom-=33.33%"`, `once`.

Как устроены секции с движением:
- `Kitchen` — лента блюд: секция пинится, кадры едут по горизонтали со `scrub`
  вдоль дуги (высота и наклон считаются от расстояния до центра экрана),
  название блюда проявляется у кадра в центре;
- `Spaces` — четыре этапа в запиненной секции: снимки одной диагональной линией
  переезжают из нижнего правого угла в верхний левый, на каждом этапе видно три
  кадра (линия закольцована хвостами), подписи закреплены на местах и меняются
  масками;
- `Story` — карусель на Embla.

### Навигация

Пункты меню и контакты — `shared/config/nav.ts`; `id` пунктов обязаны совпадать
с `id` секций (`legend`, `kitchen`, `spaces`, `events`, `contacts`), иначе якоря
и кнопка «ЛИСТАТЬ» (скролл через Lenis) промахиваются.

## Состояние

Свёрстаны все секции макета: `SiteHeader`, `Hero`, `Legend`, `Kitchen`,
`Spaces`, `Interior`, `Story`, `Events`, `Contacts`, `SiteFooter`. Движение
есть в `Kitchen`, `Spaces` и `Story`; страниц меню и бара пока нет.

Что ждёт данных от клиента (помечено TODO в коде):
- шрифт «a RomanusTitul»;
- тексты и фото слайдов 2—5 в `widgets/Story/model/slides.ts` (в макете рыба,
  текст второго слайда написан нами);
- три пространства из четырёх в `widgets/Spaces/model/spaces.ts`: дословно из
  макета только BISTRO (02), названия и цифры BAR, CHAMBER и TERRACE
  придуманы, фото временные;
- названия блюд в `widgets/Kitchen/ui/KitchenGallery.tsx` — из макета только
  «карбонара»;
- файл презентации в `Events`, ссылки соцсетей и точка на карте в
  `shared/config/nav.ts`;
- переходы на меню и бар в `Kitchen`.

Важно про макет: секции разложены по двум фреймам — заголовочная группа и
отдельный фрейм с фотографиями, который в списке `main` идёт следующим. Пары:
Kitchen `114:2427` + `114:2448`, Spaces `114:2457` + `114:2464`, Interior
`114:2483` + `114:2489`, Story `114:2505` (заголовок) + `114:2511` (карусель).
Пропустить второй фрейм легко — при работе с секцией сверяться со списком
дочерних узлов `114:2368`.

Раскрыто только одно пространство (BISTRO, 02) — данные остальных трёх
ждём от клиента.

## Команды

```bash
npm run dev     # localhost:3000
npm run build
npm run lint
```
