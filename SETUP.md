# Auth Knit - Setup Instructions

This guide will help you set up and run the Auth Knit MERN stack application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd auth_knit
```

### 2. Install Dependencies

```bash
# Install all dependencies (both client and server)
npm run install-all

# Or install separately:
npm run install-server
npm run install-client
```

### 3. Environment Setup

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp server/env.example server/.env
```

Edit `server/.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth_knit
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
CLIENT_URL=http://localhost:3000
```

#### Client Environment Variables

Create a `.env` file in the `client` directory:

```bash
cp client/env.example client/.env
```

Edit `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use the connection string: `mongodb://localhost:27017/auth_knit`

#### Option B: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `server/.env`

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `server/.env`

### 6. Run the Application

```bash
# Start both client and server in development mode
npm run dev

# Or start them separately:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:3000
```

## Project Structure

```
auth_knit/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── server.js        # Main server file
│   └── package.json
├── package.json         # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update profile

### Todos
- `GET /api/todos` - Get all todos (with pagination and filters)
- `GET /api/todos/search` - Search todos
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion

## Features

### ✅ Implemented Features

- **Authentication**
  - JWT-based authentication
  - Google OAuth integration
  - Password hashing with bcrypt
  - Protected routes

- **Frontend**
  - React with Redux Toolkit
  - Tailwind CSS for styling
  - Responsive design
  - Form validation
  - Real-time notifications

- **Backend**
  - Express.js REST API
  - MongoDB with Mongoose
  - JWT middleware
  - Input validation
  - Error handling

- **Todo Management**
  - CRUD operations
  - Search functionality
  - Filtering and pagination
  - Priority levels
  - Due dates and tags

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access for Atlas

2. **Google OAuth Error**
   - Verify Client ID and Secret
   - Check redirect URI configuration
   - Ensure Google+ API is enabled

3. **Port Already in Use**
   - Change PORT in server `.env`
   - Kill existing processes on ports 3000/5000

4. **CORS Issues**
   - Verify CLIENT_URL in server `.env`
   - Check CORS configuration in server.js

### Development Tips

- Use browser dev tools for debugging
- Check server logs for API errors
- Use Redux DevTools for state debugging
- Test API endpoints with Postman

## Production Deployment

### Environment Variables for Production

Update environment variables for production:

```env
# Server
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://yourdomain.com

# Client
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### Deployment Options

1. **Heroku** - Easy deployment for both client and server
2. **Vercel** - Great for React frontend
3. **DigitalOcean** - Full control with droplets
4. **AWS** - Scalable cloud deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter any issues:

1. Check this setup guide
2. Review the troubleshooting section
3. Check GitHub issues
4. Create a new issue with detailed information

## License

MIT License - see LICENSE file for details.
