# Деплой — Madame Roche

Сервер общий с «Недвижкой» и Substance. IP, логины и пароли (SSH, GitLab) —
в `D:\nedvizka\DEPLOY.md`; сюда их не копируем: репозиторий уходит на GitHub.

## Что где

| | |
|---|---|
| Сервер | 93.189.231.232, пользователь деплоя `deploy` |
| GitLab | https://git.placebo25.ru/sharinigor/mmeroche |
| Путь | `/home/deploy/mmeroche` |
| PM2 | `mmeroche-front`, порт **3002** (3000 — Substance, 3001 — Недвижка) |
| Доступ по IP | http://93.189.231.232:8082 |
| Домен | TODO — ждём от клиента |
| Env | `/home/deploy/mmeroche/.env.local` |

## Первая установка

### 1. Зайти на сервер

```bash
ssh root@93.189.231.232
su - deploy
```

### 2. Клонировать и собрать

```bash
cd /home/deploy
git clone https://git.placebo25.ru/sharinigor/mmeroche.git
cd mmeroche
```

Env — ключ Яндекс.Карт тот же, что в локальном `.env` / у недвижки:

```bash
cat > .env.local <<'EOF'
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=<ключ>
NEXT_PUBLIC_SITE_URL=http://93.189.231.232:8082
EOF
```

`NEXT_PUBLIC_*` зашиваются в сборку: поменял env — пересобрать.

```bash
npm ci
npm run build
pm2 start npm --name mmeroche-front -- start -- -p 3002
pm2 save
```

`deploy.sh` (pull → `npm ci` → build → `pm2 restart mmeroche-front --update-env`)
живёт только на сервере, как у недвижки, — в репозитории его нет.

### 3. Nginx (от root)

```bash
exit   # обратно в root
cat > /etc/nginx/sites-available/mmeroche <<'EOF'
server {
    listen 8082;
    server_name _;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
ln -s /etc/nginx/sites-available/mmeroche /etc/nginx/sites-enabled/mmeroche
nginx -t && systemctl reload nginx
```

Если `sites-enabled/nedvizka` — обычный файл, а не ссылка, кладём конфиг
прямо в `sites-enabled`. Сжатие — на nginx (`compress: false` в `next.config.ts`).

Проверка: http://93.189.231.232:8082 и `/personal-data`.

### 4. Автодеплой

Вебхук-сервер общий — `/home/deploy/webhook.js` (PM2 `webhook`, порт 9000,
снаружи `:9090`). Маршрут в `ROUTES`: `/deploy-mmeroche` →
`/home/deploy/mmeroche/deploy.sh`, токен сверяется с заголовком
`X-Gitlab-Token` (значение — в самом `webhook.js` на сервере). После правки
файла — `pm2 restart webhook`.

В GitLab: Settings → Webhooks, URL `http://93.189.231.232:9090/deploy-mmeroche`,
Secret token из `webhook.js`, Push events на `main`, SSL verification выключен.
Лог деплоя — `pm2 logs webhook`.

## Ручной деплой

```bash
ssh root@93.189.231.232
su - deploy
/home/deploy/mmeroche/deploy.sh
```

## Когда появится домен

1. A-запись домена → 93.189.231.232.
2. В конфиг nginx — `server_name <домен>;` на `listen 80`, затем
   `certbot --nginx -d <домен>`.
3. `NEXT_PUBLIC_SITE_URL=https://<домен>` в `.env.local`, `./deploy.sh`.
4. Ссылку на домен — в `CONTACTS.links` (`shared/config/nav.ts`).
5. Ключ Яндекс.Карт («мадамроше» в кабинете developer.tech.yandex.ru) —
   вернуть ограничение по HTTP Referer: `localhost` и домен. Пока сайт на IP,
   ограничения сняты: IP в Referer Яндекс не принимает, а с одним `localhost`
   на сервере вместо карты показывается снимок.
