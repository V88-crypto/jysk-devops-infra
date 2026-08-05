# Jysk Clone – DevOps Infrastructure

Цей репозиторій містить DevOps-інфраструктуру для проєкту **Jysk Clone**.

Основою є Docker Compose, який дозволяє швидко розгорнути локальне середовище розробки з усіма необхідними сервісами.

---

# Вимоги

Перед початком роботи переконайтеся, що встановлено:

- Docker Desktop (Windows/macOS) або Docker Engine + Docker Compose (Linux)
- Git

---

# Швидкий запуск

## 1. Клонування репозиторію

```bash
git clone https://github.com/v88-crypto/jysk-devops-infra.git
cd jysk-devops-infra
```

## 2. Запуск проєкту

```bash
docker compose -f devops/docker-compose.yml up --build
```

Під час першого запуску Docker автоматично:

- завантажить необхідні образи;
- збере власні Docker-образи;
- створить мережу між контейнерами;
- створить томи для зберігання даних;
- запустить усі сервіси.

---

# Доступ до сервісів

Після успішного запуску будуть доступні:

| Сервіс | Адреса |
|---------|---------|
| Frontend (React) | http://localhost:3000 |
| Backend API (Python/FastAPI) | http://localhost:8000 |
| MySQL Database | localhost:3306 |

---

# Особливості

- 🔄 **Hot Reload** для Frontend і Backend.
- 💾 Дані MySQL зберігаються у Docker Volume `mysql_data`.
- 🐳 Всі сервіси запускаються однією командою.
- 🌐 Контейнери працюють в окремій Docker Network.

---

# Зупинка проєкту

Зупинити контейнери:

```bash
docker compose down
```

Зупинити та видалити всі дані бази:

```bash
docker compose down -v
```

---

# Структура репозиторію

```
.
├── backend/
├── frontend/
├── devops/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
└── README.md
```

---

# Автор

DevOps Infrastructure для навчального проєкту **Jysk Clone**.
