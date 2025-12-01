# Node.js Authentication & Authorization Boilerplate

A production-ready Node.js authentication and authorization boilerplate built with Express.js, MongoDB (Mongoose), and JWT. Features include user registration, login, role-based access control (RBAC), password reset, and secure token management.

## 🚀 Features

- **Authentication**
  - User registration with validation
  - Secure login with JWT tokens
  - Access token (15min expiry) + Refresh token (7 days expiry)
  - Token refresh endpoint
  - Logout functionality
  - Password reset with token-based verification
  - Secure password hashing with bcrypt

- **Authorization**
  - Role-based access control (RBAC)
  - Admin and User roles
  - Protected routes with authentication middleware
  - Role-based route protection

- **Security**
  - bcrypt password hashing (salt rounds: 12)
  - JWT token-based authentication
  - Helmet.js for HTTP headers security
  - CORS configuration
  - Rate limiting (general + strict for auth routes)
  - MongoDB injection protection
  - Input validation with Joi
  - Password strength requirements

- **User Management**
  - Get user profile
  - Update user profile
  - Change password
  - Admin: Get all users
  - Admin: Get user by ID
  - Admin: Delete user

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone or download the project**
   ```bash
   cd node-auth-kit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - MongoDB connection string
   - JWT secrets (use strong, random strings in production)
   - Port number
   - Frontend URL for CORS

4. **Start MongoDB**
   - Local: Make sure MongoDB is running on your machine
   - Atlas: Use your MongoDB Atlas connection string

5. **Run the application**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

   The server will start on `http://localhost:5000` (or your configured PORT)

## 📁 Project Structure

```
node-auth-kit/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── jwt.js               # JWT configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── userController.js     # User management logic
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   ├── roleMiddleware.js     # Role-based authorization
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   └── User.js               # User Mongoose model
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   └── userRoutes.js         # User routes
│   ├── services/
│   │   ├── authService.js        # Authentication business logic
│   │   └── emailService.js       # Email service (placeholder)
│   ├── utils/
│   │   ├── tokenGenerator.js     # JWT token utilities
│   │   ├── validators.js         # Joi validation schemas
│   │   ├── responseFormatter.js  # Standardized API responses
│   │   └── emailValidator.js     # Email validation helpers
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional, defaults to "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "password-reset-token",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. Please login with your new password."
}
```

### User Routes (Protected)

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
}
```

#### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Admin Routes (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <adminAccessToken>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <adminAccessToken>
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <adminAccessToken>
```

## 🔐 Security Features

1. **Password Hashing**: Uses bcrypt with 12 salt rounds
2. **JWT Tokens**: Separate access and refresh tokens with different expiry times
3. **Rate Limiting**: 
   - General: 100 requests per 15 minutes
   - Auth routes: 5 requests per 15 minutes
4. **Helmet**: Sets secure HTTP headers
5. **CORS**: Configurable CORS for frontend integration
6. **Input Validation**: Joi schemas for all inputs
7. **MongoDB Injection Protection**: express-mongo-sanitize
8. **Token Storage**: Refresh tokens stored in database

## 🧪 Testing with Postman

### Import Collection

1. Create a new Postman collection
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `accessToken`: (will be set after login)
   - `refreshToken`: (will be set after login)

### Example Requests

#### 1. Register
```
POST {{baseUrl}}/api/auth/register
Body (raw JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### 2. Login
```
POST {{baseUrl}}/api/auth/login
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```
Save `accessToken` and `refreshToken` from response to environment variables.

#### 3. Get Profile (Protected)
```
GET {{baseUrl}}/api/users/profile
Headers:
  Authorization: Bearer {{accessToken}}
```

#### 4. Refresh Token
```
POST {{baseUrl}}/api/auth/refresh
Body (raw JSON):
{
  "refreshToken": "{{refreshToken}}"
}
```

#### 5. Update Profile
```
PUT {{baseUrl}}/api/users/profile
Headers:
  Authorization: Bearer {{accessToken}}
Body (raw JSON):
{
  "name": "Updated Name"
}
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options:

- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_ACCESS_SECRET`: Secret for access tokens
- `JWT_REFRESH_SECRET`: Secret for refresh tokens
- `JWT_PASSWORD_RESET_SECRET`: Secret for password reset tokens
- `JWT_ACCESS_EXPIRY`: Access token expiry (default: 15m)
- `JWT_REFRESH_EXPIRY`: Refresh token expiry (default: 7d)
- `FRONTEND_URL`: Frontend URL for CORS and email links

### Creating an Admin User

To create an admin user, you can:

1. Register normally and update the role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. Or modify the registration endpoint to allow admin creation (not recommended for production without additional security)

## 📝 Code Structure

### Middleware Flow

1. **Authentication Middleware** (`authMiddleware.js`):
   - Verifies JWT access token
   - Attaches user to `req.user`
   - Used on protected routes

2. **Role Middleware** (`roleMiddleware.js`):
   - Checks user role against required roles
   - Must be used after authentication middleware
   - Example: `authorizeRoles('admin')`

3. **Error Middleware** (`errorMiddleware.js`):
   - Catches all errors
   - Formats error responses
   - Handles specific error types (JWT, Mongoose, etc.)

### Service Layer

Business logic is separated into services:
- `authService.js`: Authentication operations
- `emailService.js`: Email sending (placeholder - integrate with your email provider)

### Validation

All inputs are validated using Joi schemas in `utils/validators.js`. Validation happens in controllers before processing.

## 🚨 Error Handling

All errors are caught and formatted consistently:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT token handling
- **bcryptjs**: Password hashing
- **joi**: Input validation
- **dotenv**: Environment variables
- **cors**: CORS middleware
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **express-mongo-sanitize**: MongoDB injection protection

## 🔄 Token Flow

1. **Login/Register**: User receives both `accessToken` and `refreshToken`
2. **Access Protected Routes**: Use `accessToken` in Authorization header
3. **Token Expires**: When `accessToken` expires, use `refreshToken` to get new `accessToken`
4. **Logout**: Clears `refreshToken` from database

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Note**: This is a boilerplate. Make sure to:
- Change all JWT secrets in production
- Use strong, randomly generated secrets
- Configure proper CORS origins
- Set up proper email service
- Add monitoring and logging
- Review and adjust rate limits based on your needs
- Add proper error logging in production

