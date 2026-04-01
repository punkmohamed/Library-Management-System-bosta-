# Library Management System (Bosta)

A simple yet powerful Library Management System designed to manage books, authors, and borrowers with ease. Built with Node.js, Express, Sequelize, and PostgreSQL.

## 🚀 Features

### 1. Book Management
- **Add Books**: Register new books with details (Title, Author, ISBN, Quantity, Shelf Location).
- **Update Books**: Modify book details (Title, ISBN, Quantity, Shelf Location). *Note: Author cannot be changed after creation.*
- **Delete Books**: Remove books from the system (only if they are not currently borrowed).
- **Consolidated Search & Listing**: List all books or search for specific ones by **Title**, **Author Name**, or **ISBN** using a single unified endpoint.

### 2. User (Borrower) Management
- **Centralized Auth & Management**: Registration, Login, and User management are unified in the Auth module.
- **Borrower Registration**: Simple registration with Name and Email.
- **Update Details**: Modify user profile information.
- **Delete Users**: Remove users and their active sessions from the system.
- **Listing**: View all registered borrowers.

### 3. Borrowing Process
- **Checkout**: Borrowers can check out available books. The system tracks availability and prevents double-borrowing of the same book.
- **Returns**: Easy return process that automatically restores book availability.
- **Personal Dashboard**: Borrowers can view a list of books they currently have checked out.
- **Overdue Tracking**: System identifies and lists books that have passed their return due date.

### 4. API Security & Rate Limiting
- **Abuse Prevention**: Implemented rate limiting on sensitive endpoints (**Login**, **Register**, and **Checkout**) to protect the system from brute-force attacks and automated abuse.

### 5. Quality Assurance
- **Unit Testing**: Comprehensive unit tests for the **Author** module using Jest, ensuring core business logic reliability and preventing regressions.

## 🛠️ Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Documentation**: Swagger (OpenAPI)
- **Validation**: express-validator

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

### Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd bosta
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bosta
   JWT_SECRET=bosta_secret
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=bosta_secret
   JWT_REFRESH_EXPIRES_IN=30d

   
   ```

4. **Setup Database**:
   Ensure your PostgreSQL database `bosta` exists. The system uses `sequelize.sync({ alter: true })` on startup to automatically manage schema migrations in development.

5. **Run the application**:
   ```bash
   npm run dev
   ```

6. **Run Tests**:
   ```bash
   npm test
   ```

## 📖 API Documentation

The full interactive API documentation is available via Swagger. Once the server is running, visit:
**`http://localhost:3000/api-docs`**

### Key Endpoints

#### Authentication & Users
- `POST /api/v1/auth/register` - Register a new user/borrower.
- `POST /api/v1/auth/login` - Login to receive JWT Access & Refresh tokens.
- `GET /api/v1/auth/users` - List all users (Protected).
- `PUT /api/v1/auth/users/:id` - Update user details (Protected).

#### Books
- `GET /api/v1/books` - List all books. Use `?query=...` to search by title, author, or ISBN.
- `POST /api/v1/books` - Add a new book (Protected).
- `PUT /api/v1/books/:id` - Update book details (Protected).
- `DELETE /api/v1/books/:id` - Delete a book (Protected).

#### Authors
- `GET /api/v1/authors` - List all authors.
- `POST /api/v1/authors` - Add a new author (Protected).

#### Borrowing
- `POST /api/v1/borrowing/checkout` - Checkout a book.
- `POST /api/v1/borrowing/return` - Return a borrowed book.
- `GET /api/v1/borrowing/current/:user_id` - List current borrowings for a user.
- `GET /api/v1/borrowing/overdue` - List all overdue books.

## 🛡️ Security
- **JWT Authentication**: Protected routes require a Bearer Token in the Authorization header.
- **Atomic Operations**: Critical operations like deletion and borrowing use **Database Transactions** to ensure data consistency.
- **Input Validation**: All requests are validated using `express-validator` to ensure data integrity.
- **Unit Testing**: Comprehensive unit tests for the **Author** module using Jest to ensure business logic reliability.
- **Rate Limiting**: Prevent abuse with specific limits on sensitive endpoints:
    - **Login**: Max 5 attempts per 15 minutes.
    - **Register**: Max 3 registrations per hour from the same IP.
    - **Checkout**: Max 10 checkout requests per 10 minutes.
