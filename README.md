# Writers Desk India - Admin Panel & Backend

This repository contains the admin panel and backend API for Writers Desk India.

## Project Structure

```
.
├── admin/          # React admin panel
├── backend/        # Express.js API server
└── client/         # Main client website
```

## Admin Panel

React-based admin dashboard for managing books, collections, and orders.

### Features
- Admin login (no signup)
- Dashboard with statistics
- Book management (CRUD operations)
- User authentication with JWT
- Protected routes

### Tech Stack
- React 18
- Vite
- React Router
- Zustand (state management)
- Axios (HTTP client)

### Setup
```bash
cd admin
npm install  # or bun install
npm run dev
```

The admin panel will be available at `http://localhost:3000`

## Backend API

Express.js server with MongoDB for data persistence.

### Features
- Admin authentication
- JWT token-based authorization
- RESTful API for books, collections, and orders
- MongoDB data persistence
- CORS support

### Tech Stack
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)

### Setup
```bash
cd backend
npm install
npm run dev
```

The API server will be available at `http://localhost:4000`

### Environment Variables
Create a `.env` file based on `.env.example`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/writers-desk-india
JWT_SECRET=your_secret_key_here
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

## Getting Started

1. **Setup MongoDB**
   - Ensure MongoDB is running on your local machine
   - Or use MongoDB Atlas cloud service

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Setup Admin Panel**
   ```bash
   cd admin
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Create Admin User**
   - Insert an admin user directly in MongoDB or create an admin seeding script
   - Email: admin@example.com
   - Password: (will be hashed)

5. **Login**
   - Navigate to `http://localhost:3000`
   - Login with admin credentials

## Development Notes

- Admin panel uses Vite for fast development
- Backend uses nodemon for auto-reload
- All passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- API responses follow standard JSON format

## Future Enhancements

- [ ] Admin user management
- [ ] Collections management
- [ ] Orders management
- [ ] File upload for book covers
- [ ] Advanced search and filtering
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Audit logs
