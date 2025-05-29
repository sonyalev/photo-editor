# Photo Editor
Веб-додаток для редагування фотографій із підтримкою автентифікації, збереження зображень у хмарі та обробки повідомлень користувачів.
______________________________________________

## Основні можливості
- Завантаження та редагування зображень (фільтри, обрізка).
- Збереження зображень у хмарі для зареєстрованих користувачів.
- Реєстрація та автентифікація користувачів.
- Форма для надсилання повідомлень.

## Технології
- Backend: Node.js, Express, PostgreSQL, Multer, Bcrypt.
- Frontend: React, React Router, react-cropper, react-toastify, Canvas API.
- Стилі: CSS, Google Fonts.

## Встановлення

1. Клонувати репозиторій

       git clone https://github.com/sonyalev/photo-editor/tree/final
       cd photo-editor

2. Встановити залежності
- Для backend

      cd backend
      npm install  

- Для frontend

      cd frontend
      npm install

3. Налаштувати змінні середовища

 - Створіть файл .env у папці backend і додайте

       DB_USER=your_db_user
       DB_PASSWORD=your_db_password
       DB_HOST=your_db_host
       DB_PORT=your_db_port
       DB_NAME=your_db_name

- У папці frontend створіть .env

      REACT_APP_API_URL=http://localhost:5000

4. Налаштувати базу даних

- Створіть базу даних PostgreSQL і таблиці

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE images (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        filename VARCHAR(255) NOT NULL,
        filepath VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );

      CREATE TABLE contacts (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        inquiry_type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       );

5. Запустити проєкт
 - Backend

       cd backend
       npm start

- Frontend

       cd frontend
       npm start


## Автор
 [_Левчук Софія_](https://www.linkedin.com/in/sofia-levchuk-98a4062a5/)

