# Notes App

A full-stack note-taking application built with Laravel (backend API) and React (frontend client). This application provides a modern, intuitive interface for creating, organizing, and managing notes with rich text editing capabilities.

## 🚀 Features

### Core Features
- **User Authentication** - Secure registration and login system
- **Note Management** - Create, read, update, and delete notes
- **Categories/Tags** - Organize notes with custom categories and tags
- **Search Functionality** - Quick search across all notes
- **Favorites** - Mark important notes as favorites
- **Archive** - Archive old notes without deleting them
- **Trash** - Soft delete with restore capability
- **Note Sharing** - Share notes via link (optional)
- **Dark Mode** - Toggle between light and dark themes

## 🛠️ Tech Stack

### Backend (API)
- **Framework:** Laravel 10.x
- **Database:** MySQL
- **Authentication:** Laravel Sanctum
- **File Storage:** Laravel Storage
- **Validation:** Laravel Form Requests

### Frontend (Client)
- **Framework:** React 18.x
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **UI Framework:** Tailwind CSS
- **Notifications:** React Toastify

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- PHP >= 8.1
- Composer
- Node.js >= 16.x
- npm or yarn
- MySQL >= 5.7

## 🔧 Installation

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/raivokinne/notes-app.git
cd notes-app
```

2. **Navigate to backend directory**
```bash
cd backend
```

3. **Install PHP dependencies**
```bash
composer install
```

4. **Create environment file**
```bash
cp .env.example .env
```

5. **Configure your `.env` file**
```env
APP_NAME="Notes App"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=notes_app
DB_USERNAME=your_username
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

6. **Generate application key**
```bash
php artisan key:generate
```

7. **Run database migrations**
```bash
php artisan migrate
```

8. **Seed database (optional)**
```bash
php artisan db:seed
```

9. **Create storage link**
```bash
php artisan storage:link
```

10. **Start the Laravel development server**
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install Node dependencies**
```bash
npm install
# or
yarn install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Start the React development server**
```bash
npm run dev
# or
yarn dev
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
notes-app/
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── NoteController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   └── TagController.php
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Note.php
│   │   │   ├── Category.php
│   │   │   └── Tag.php
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── storage/
│
└── frontend/                 # React Client
    ├── public/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   ├── utils/
    │   ├── App.js
    │   └── index.js
    └── package.json
```
