# DevIT Monorepo - Client-Server Data Fetch

[English](#english) | [Українська](#українська)

---

## English

### Project Description

This is a full-stack TypeScript project built using an **Nx Monorepo**. The application demonstrates a client-server architecture handling high-concurrency API requests while enforcing server-side rate limits.

The task implements a scenario where the React frontend sends up to 1000 asynchronous HTTP requests to a backend API. The frontend controls concurrency and limiting, while the backend utilizes Redis to track and enforce a strict 50 requests/second limit, returning a `429 Too Many Requests` error if exceeded.

**Technology Stack:**

- **Language:** TypeScript
- **Frontend:** ReactJS (Vite)
- **Backend:** NestJS / Koa / Express
- **Storage:** Redis (for rate-limiting)
- **Environment:** Docker
- **Workspace:** Nx

### How to Start the Project

**Prerequisites:**

- Node.js (version 22+ recommended)
- Docker Desktop (must be running to use Redis)

1. **Install Dependencies**
   Run the following command in the root directory:

   ```bash
   npm install
   ```

2. **Start the Application**
   You can start both the frontend, backend, and the Redis database simultaneously with a single command:

   ```bash
   make start
   ```

   _(This command runs `docker-compose up -d redis` followed by `npx nx run-many --target=serve`)_

3. **Access the Apps**
   - Frontend is typically available at `http://localhost:4200`
   - Backend API is typically running on `http://localhost:3000`

---

## Українська

### Опис проекту

Це full-stack проект на TypeScript, створений на базі **монорепозиторію Nx**. Застосунок демонструє клієнт-серверну архітектуру з обробкою висококонкурентних API-запитів та дотриманням лімітів на стороні сервера.

Завдання реалізує сценарій, у якому React-фронтенд надсилає до 1000 асинхронних HTTP-запитів до бекенд-API. Фронтенд контролює ліміт конкурентності, тоді як бекенд використовує Redis для відстеження та забезпечення жорсткого ліміту в 50 запитів на секунду, повертаючи помилку `429 Too Many Requests` у разі перевищення.

**Технологічний стек:**

- **Мова:** TypeScript
- **Frontend:** ReactJS (Vite)
- **Backend:** NestJS / Koa / Express
- **Сховище:** Redis (для обмеження швидкості запитів)
- **Середовище:** Docker
- **Робочий простір:** Nx

### Як запустити проект

**Вимоги:**

- Node.js (рекомендується версія 22+)
- Docker Desktop (має бути запущений для роботи Redis)

1. **Встановіть залежності**
   Виконайте наступну команду в кореневій папці:

   ```bash
   npm install
   ```

2. **Запустіть застосунок**
   Ви можете запустити фронтенд, бекенд та базу даних Redis одночасно за допомогою однієї команди:

   ```bash
   make start
   ```

   _(Ця команда автоматично виконує `docker-compose up -d redis`, а потім `npx nx run-many --target=serve`)_

3. **Доступ до додатків**
   - Frontend зазвичай доступний за адресою `http://localhost:4200`
   - Backend API зазвичай працює на порту `http://localhost:3000`
