# Jysk Clone – DevOps Infrastructure

Цей репозиторій містить інфраструктуру та код навчального проєкту **Jysk Clone**.

Для локального середовища використовується Docker Compose, який запускає Frontend, Backend, MySQL та MinIO в єдиній Docker-мережі.

---

# Вимоги

Перед початком роботи переконайтеся, що встановлено:

* Docker Desktop (Windows/macOS) або Docker Engine + Docker Compose (Linux)
* Git

---

# Швидкий запуск

## 1. Клонування репозиторію

```bash
git clone https://github.com/V88-crypto/jysk-devops-infra.git
cd jysk-devops-infra
```

## 2. Налаштування змінних середовища

Створіть локальний `.env` на основі шаблону:

```bash
cp .env.example .env
```

Файл `.env` містить локальні змінні середовища та не повинен потрапляти до Git.

Приклад змінних для MinIO:

```env
MINIO_ROOT_USER=localadmin
MINIO_ROOT_PASSWORD=localadmin123456
```

Значення у `.env.example` призначені лише для локального development-середовища. Для production необхідно використовувати окремі безпечні credentials.

## 3. Авторизація в GitHub Container Registry (GHCR)

Для запуску MinIO використовуються приватні Docker-образи з GitHub Container Registry:

- `ghcr.io/v88-crypto/jysk-minio:RELEASE.2025-09-07T16-13-09Z`
- `ghcr.io/v88-crypto/jysk-minio-mc:RELEASE.2025-08-13T08-35-41Z`

Кожному учаснику необхідно мати доступ `Read` до обох пакетів у GHCR.

1. У GitHub відкрийте **Settings → Developer settings → Personal access tokens → Tokens (classic)**.
2. Створіть особистий токен із дозволом `read:packages`. Якщо організація використовує SSO, авторизуйте токен для неї.
3. У терміналі виконайте:

```bash
read -rsp 'GitHub token: ' GHCR_TOKEN; echo
printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
unset GHCR_TOKEN
```

Замініть `YOUR_GITHUB_USERNAME` власним GitHub-логіном. Не передавайте токен іншим учасникам, не додавайте його до Git та не вставляйте в `.env` проєкту.

Після успішної авторизації можна запускати Docker Compose за інструкцією нижче. Опубліковані образи призначені для платформи `linux/amd64`.

## 4. Запуск проєкту

Запускайте команду з кореневої директорії репозиторію:

```bash
docker compose --env-file .env -f devops/docker-compose.yml up -d --build
```

Під час першого запуску Docker:

* завантажить необхідні образи;
* збере Backend та Frontend;
* створить Docker network;
* створить persistent volumes;
* запустить MySQL та MinIO;
* автоматично створить MinIO bucket `images`;
* запустить Backend і Frontend.

---

# Доступ до сервісів

| Сервіс                | Адреса                  |
| --------------------- | ----------------------- |
| Frontend (React)      | `http://localhost:3000` |
| Backend API (FastAPI) | `http://localhost:8000` |
| MySQL                 | `localhost:3306`        |
| MinIO S3 API          | `http://localhost:9000` |
| MinIO Console         | `http://localhost:9001` |

---

# MinIO Object Storage

## Походження Docker-образів та ліцензія

Для локального середовища використовуються образи MinIO Server і MinIO Client (mc), повторно опубліковані в приватному GitHub Container Registry (GHCR).

Вихідний код відповідних версій:

- MinIO Server: https://github.com/minio/minio/tree/RELEASE.2025-09-07T16-13-09Z
- MinIO Client (mc): https://github.com/minio/mc/tree/RELEASE.2025-08-13T08-35-41Z

Обидва проєкти поширюються за ліцензією GNU AGPLv3.

Образи були повторно позначені та опубліковані з локального Docker-кешу, а не зібрані заново з вихідного коду. Їхня відповідність вихідному коду та відсутність вразливостей окремо не перевірялися.

При подальшому розповсюдженні необхідно дотримуватися вимог відповідних ліцензій, зокрема щодо доступності вихідного коду.

MinIO використовується як S3-compatible object storage для зберігання файлів та зображень.

При запуску Docker Compose сервіс `minio-init` автоматично створює bucket:

```text
images
```

Bucket `images` налаштований як **private**. Frontend не повинен містити MinIO credentials або напряму використовувати приватний MinIO API.

Рекомендований потік роботи:

```text
Frontend
   |
   v
Backend API
   |
   v
Private MinIO bucket (images)
```

Всередині Docker network Backend звертається до MinIO за адресою:

```text
minio:9000
```

а не `localhost:9000`.

Backend отримує такі змінні середовища:

```env
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=${MINIO_ROOT_USER}
MINIO_SECRET_KEY=${MINIO_ROOT_PASSWORD}
MINIO_BUCKET=images
MINIO_SECURE=false
```

Таким чином Backend може використовувати S3-compatible клієнт для роботи з об'єктами в MinIO.

---

# Persistent Storage

Docker Compose використовує два persistent volumes:

```text
mysql_data
minio_data
```

`mysql_data` зберігає дані MySQL.

`minio_data` зберігає об'єкти MinIO, тому завантажені файли не зникають після звичайного перезапуску контейнера.

---

# Перевірка контейнерів

Переглянути стан усіх сервісів:

```bash
docker compose --env-file .env -f devops/docker-compose.yml ps -a
```

MinIO повинен мати статус:

```text
healthy
```

`minio-init` є одноразовим initialization container, тому після успішного створення bucket його нормальний стан:

```text
Exited (0)
```

Переглянути його лог:

```bash
docker logs jysk_clone_minio_init
```

---

# Особливості

* Docker Compose для локального середовища.
* Єдина Docker network `jysk_network`.
* MySQL як основна база даних.
* MinIO як S3-compatible object storage.
* Автоматичне створення приватного bucket `images`.
* Persistent storage для MySQL та MinIO.
* Environment variables через `.env`.
* `.env` виключений із Git.
* `.env.example` використовується як шаблон конфігурації.

---

# Зупинка проєкту

Зупинити контейнери:

```bash
docker compose --env-file .env -f devops/docker-compose.yml down
```

Зупинити контейнери та **видалити persistent volumes**:

```bash
docker compose --env-file .env -f devops/docker-compose.yml down -v
```

> **Увага:** команда `down -v` видаляє persistent data, включаючи дані MySQL та файли MinIO.

---

# Структура репозиторію

```text
.
├── backend/
├── frontend/
├── devops/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── .env.example
├── .gitignore
└── README.md
```

---

# Архітектура локального середовища

```text
                    Docker Compose
                          |
              +-----------+-----------+
              |                       |
          Frontend                 Backend
           :3000                    :8000
                                      |
                         +------------+------------+
                         |                         |
                       MySQL                     MinIO
                       :3306                     :9000
                                                  |
                                             images bucket
```

---

# DevOps

DevOps Infrastructure: **Віталій Лисак**
Навчальний проєкт **Jysk Clone**.
