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

## 3. Запуск проєкту

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
