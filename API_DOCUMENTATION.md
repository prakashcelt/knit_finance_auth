# Auth Knit - API Documentation

This document provides comprehensive API documentation for the Auth Knit backend.

## Base URL

**Production:**
```
https://knit-finance-auth.onrender.com/api
```

**Development:**
```
http://localhost:5001/api
```

## Environment Variables

For frontend applications, set the following environment variable:

```
REACT_APP_API_URL=https://knit-finance-auth.onrender.com/api
```

## Authentication

Most endpoints require authentication via JWT token. Include the token in the request:

### Headers
```
Authorization: Bearer <your_jwt_token>
```

### Cookies
The server also accepts JWT tokens via HTTP-only cookies for enhanced security.

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "errors": [] // Optional: validation errors
}
```

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

### Login User

**POST** `/auth/login`

Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt_token"
}
```

### Google OAuth

**GET** `/auth/google`

Initiate Google OAuth flow.

**Response:** Redirects to Google OAuth consent screen.

**GET** `/auth/google/callback`

Google OAuth callback endpoint (handled automatically).

### Get Current User

**GET** `/auth/me`

Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://...",
    "isEmailVerified": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update Profile

**PUT** `/auth/profile`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "user"
  }
}
```

### Logout

**POST** `/auth/logout`

Logout user and clear authentication.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Todo Endpoints

### Get All Todos

**GET** `/todos`

Get paginated list of todos for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `completed` (optional): Filter by completion status (true/false)
- `priority` (optional): Filter by priority (low/medium/high)

**Example:** `/todos?page=1&limit=10&completed=false&priority=high`

**Response:**
```json
{
  "todos": [
    {
      "_id": "todo_id",
      "title": "Complete project",
      "description": "Finish the MERN stack project",
      "completed": false,
      "priority": "high",
      "dueDate": "2023-12-31T00:00:00.000Z",
      "tags": ["work", "urgent"],
      "user": "user_id",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### Search Todos

**GET** `/todos/search`

Search todos by title, description, or tags.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:** `/todos/search?q=project&page=1&limit=10`

**Response:**
```json
{
  "todos": [...],
  "query": "project",
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10
  }
}
```

### Get Single Todo

**GET** `/todos/:id`

Get a specific todo by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "todo": {
    "_id": "todo_id",
    "title": "Complete project",
    "description": "Finish the MERN stack project",
    "completed": false,
    "priority": "high",
    "dueDate": "2023-12-31T00:00:00.000Z",
    "tags": ["work", "urgent"],
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Create Todo

**POST** `/todos`

Create a new todo.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the MERN stack project",
  "priority": "high",
  "dueDate": "2023-12-31",
  "tags": ["work", "urgent"]
}
```

**Validation Rules:**
- `title`: Required, 1-100 characters
- `description`: Optional, max 500 characters
- `priority`: Optional, one of: low, medium, high (default: medium)
- `dueDate`: Optional, valid ISO date string
- `tags`: Optional, array of strings, max 5 tags, each max 20 characters

**Response:**
```json
{
  "message": "Todo created successfully",
  "todo": {
    "_id": "todo_id",
    "title": "Complete project",
    "description": "Finish the MERN stack project",
    "completed": false,
    "priority": "high",
    "dueDate": "2023-12-31T00:00:00.000Z",
    "tags": ["work", "urgent"],
    "user": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update Todo

**PUT** `/todos/:id`

Update an existing todo.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated project title",
  "description": "Updated description",
  "completed": true,
  "priority": "medium",
  "dueDate": "2023-12-25",
  "tags": ["work", "completed"]
}
```

**Response:**
```json
{
  "message": "Todo updated successfully",
  "todo": {
    "_id": "todo_id",
    "title": "Updated project title",
    "description": "Updated description",
    "completed": true,
    "priority": "medium",
    "dueDate": "2023-12-25T00:00:00.000Z",
    "tags": ["work", "completed"],
    "user": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### Delete Todo

**DELETE** `/todos/:id`

Delete a todo.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Todo deleted successfully"
}
```

### Toggle Todo Completion

**PATCH** `/todos/:id/toggle`

Toggle the completion status of a todo.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Todo status updated successfully",
  "todo": {
    "_id": "todo_id",
    "title": "Complete project",
    "description": "Finish the MERN stack project",
    "completed": true,
    "priority": "high",
    "dueDate": "2023-12-31T00:00:00.000Z",
    "tags": ["work", "urgent"],
    "user": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

## Health Check

### Server Health

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "message": "Server is running!",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider implementing rate limiting middleware.

## CORS

The API is configured to accept requests from:
- `http://localhost:3000` (development)
- `http://127.0.0.1:3000` (alternative localhost)
- Configured via `CLIENT_URL` environment variable

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- HTTP-only cookies for token storage
- Google OAuth integration

## Postman Collection

You can import the following Postman collection to test the API:

```json
{
  "info": {
    "name": "Auth Knit API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://knit-finance-auth.onrender.com/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  }
}
```

## Testing

Use the following tools to test the API:

1. **Postman** - GUI-based API testing
2. **curl** - Command-line testing
3. **Thunder Client** - VS Code extension
4. **Insomnia** - Alternative to Postman

### Example curl commands:

**Production:**
```bash
# Register user
curl -X POST https://knit-finance-auth.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST https://knit-finance-auth.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get todos (replace TOKEN with actual JWT)
curl -X GET https://knit-finance-auth.onrender.com/api/todos \
  -H "Authorization: Bearer TOKEN"
```

**Development:**
```bash
# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get todos (replace TOKEN with actual JWT)
curl -X GET http://localhost:5001/api/todos \
  -H "Authorization: Bearer TOKEN"
```
