# Auth Knit - MERN Stack Application

A full-stack web application built with React, Node.js, Express, and MongoDB featuring JWT authentication and Google OAuth integration.

## Features

- 🔐 JWT-based authentication with secure token handling
- 🔑 Google OAuth integration with Passport.js
- 📝 Todo CRUD operations with advanced search functionality
- 🎨 Modern UI with Tailwind CSS and responsive design
- 🔄 State management with Redux Toolkit
- 🛡️ Protected routes and authentication middleware
- 📱 Mobile-responsive design
- 🔍 Real-time search with debouncing
- 🏷️ Todo tagging and priority system
- 📅 Due date management
- 🎯 Filtering and pagination

## Tech Stack

### Frontend
- React.js 18
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Router v6 with future flags
- Axios for API calls
- React Hooks (useState, useEffect, useCallback, useRef)

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication with secure middleware
- Passport.js for Google OAuth
- bcrypt for password hashing
- Express Validator for input validation
- CORS configuration for cross-origin requests

## Project Structure

```
auth_knit/
├── client/                    # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── layout/       # Layout components (Navbar, Sidebar)
│   │   │   ├── todos/        # Todo-related components
│   │   │   └── ui/           # UI components (Loading, Notifications)
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store and slices
│   │   └── App.js            # Main app component
│   └── package.json
├── server/                   # Node.js backend
│   ├── config/              # Configuration files (Passport)
│   ├── middleware/          # Custom middleware (Auth)
│   ├── models/             # Mongoose models (User, Todo)
│   ├── routes/             # API routes (Auth, Todos)
│   ├── server.js           # Main server file
│   └── package.json
├── package.json            # Root package.json for scripts
├── README.md              # This file
├── SETUP.md              # Detailed setup instructions
└── API_DOCUMENTATION.md  # Complete API reference
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `env.example` to `.env` in both client and server folders
   - Fill in your MongoDB URI and Google OAuth credentials

4. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Environment Variables

### Server (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/auth_knit
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
CLIENT_URL=http://localhost:3000
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Key Features Implemented

### ✅ Authentication System
- **JWT-based authentication** with secure token handling
- **Google OAuth integration** with Passport.js
- **Account linking** - Google accounts can be linked to existing email/password accounts
- **Protected routes** with authentication middleware
- **Secure password hashing** with bcrypt

### ✅ Todo Management
- **Full CRUD operations** for todos
- **Advanced search functionality** with debouncing
- **Filtering by status and priority**
- **Pagination support**
- **Todo tagging system**
- **Due date management**
- **Priority levels** (low, medium, high)

### ✅ User Experience
- **Responsive design** that works on all devices
- **Real-time notifications** for user actions
- **Loading states** and error handling
- **Clean, modern UI** with Tailwind CSS
- **Static user icons** instead of profile pictures

### ✅ Technical Features
- **Redux state management** with proper async handling
- **Debounced search** to prevent excessive API calls
- **CORS configuration** for secure cross-origin requests
- **Input validation** on both client and server
- **Error handling** with user-friendly messages

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Todos
- `GET /api/todos` - Get all todos with pagination and filters
- `GET /api/todos/search` - Search todos by title, description, or tags
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion

### Health Check
- `GET /api/health` - Server health check

## Development

### Available Scripts
```bash
npm run dev          # Start both client and server
npm run server       # Start only the backend server
npm run client       # Start only the frontend
npm run install-all  # Install dependencies for both client and server
```

### Testing the API
- Use the provided Postman collection (see `API_DOCUMENTATION.md`)
- Test with curl commands (examples in API documentation)
- Use Thunder Client or Insomnia for API testing

## Production Deployment

### Environment Variables for Production
```env
# Server
NODE_ENV=production
PORT=5001
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
CLIENT_URL=https://yourdomain.com

# Client
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### Deployment Options
- **Heroku** - Easy deployment for both client and server
- **Vercel** - Great for React frontend
- **DigitalOcean** - Full control with droplets
- **AWS** - Scalable cloud deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

- **SETUP.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - Complete API reference with examples
- **Postman Collection** - Ready-to-import API collection

## License

MIT License - see LICENSE file for details.
