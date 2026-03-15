Implement client-server data fetch logic by following the next steps:

1. Display an input (required, type number, from 0 to 100) and the "Start" button. Clicking the "Start" button you will disable it and start sending 1000 asynchronous HTTP requests to a server's "/api" endpoint in the following way:
   1. The input value should be used as a concurrency limit, e.g. if concurrency is 10 - you should always have 10 active requests in your browser network console, but it should not conflict with requests limit (point 2).
   2. The input value should be used as requests limit per second, e.g. 10 requests per second.
   3. Send a request index (1, 2, 3, ....) to a server
2. Server-side logic should handle requests to "/api" endpoint:
   1. Make a random delay before sending a response: from 1ms to 2000ms
   2. A successful response data should be an index from a request
   3. Return 429-code error response if received more than 50 requests per second
3. Client-side JS should render the results of server responses (request indexes) to one list immediately after each response

Technology stack:

- Language: TypeScript
- Frontend: ReactJS
- Backend (one of): NestJS / Koa / Express
- Storage: Redis (to manage server-side request limits)
- Environment: Docker Compose
  - NodeJS container
  - Redis container
- Build (optional): Makefile (use GNU Make to write simple instructions to build and run Docker containers):
  - make up - build project and up containers
  - make down - stop containers

---

**Реалізуйте логіку отримання даних між клієнтом та сервером, дотримуючись наступних кроків:**

1. Відобразіть поле введення (input) (обов'язкове, тип `number`, від 0 до 100) та кнопку "Start". При першому натисканні на кнопку "Start" потрібно зробити її неактивною і почати надсилати 1000 асинхронних HTTP-запитів до кінцевої точки (endpoint) сервера `"/api"` наступним чином:
   1. Значення, введене в поле, має використовуватися як ліміт конкурентності, наприклад, якщо конкурентність дорівнює 10 - у вас завжди має бути 10 активних запитів у консолі мережі браузера, але це не повинно конфліктувати з лімітом запитів (пункт 2).
   2. Значення, введене в поле, має використовуватися як ліміт запитів на секунду, наприклад, 10 запитів на секунду.
   3. Надішліть індекс запиту (1, 2, 3, ....) на сервер.
2. Серверна логіка повинна обробляти запити до кінцевої точки `"/api"`:
   1. Зробити випадкову затримку перед надсиланням відповіді: від 1 мс до 2000 мс.
   2. У разі успішної відповіді даними має бути індекс із запиту.
   3. Повернути відповідь з помилкою та кодом 429, якщо отримано більше 50 запитів на секунду.
3. Клієнтська частина (JS) повинна відображати результати відповідей сервера (індекси запитів) в єдиний список одразу після кожної відповіді.

**Технологічний стек:**

- **Мова:** TypeScript
- **Frontend:** ReactJS
- **Backend (один із):** NestJS / Koa / Express
- **Сховище:** Redis (для управління лімітами запитів на сервері)
- **Середовище:** Docker Compose
  - Контейнер NodeJS
  - Контейнер Redis
- **Збірка (необов'язково):** Makefile (використовуйте GNU Make для написання простих інструкцій зі збирання та запуску Docker контейнерів):
  - make up - зібрати проект та підняти контейнери
  - make down - зупинити контейнери
