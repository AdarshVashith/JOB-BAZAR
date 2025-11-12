# JOB-BAZAR - Full Stack Authentication App

A complete, production-ready full-stack authentication application built with Node.js, Express, React.js, and MongoDB.

## 📋 Project Proposal

### Overview
JOB-BAZAR is a comprehensive full-stack web application designed to provide secure user authentication and authorization services. The platform serves as a foundation for job marketplace applications, implementing industry-standard security practices and modern web development patterns.

### Objectives
- **Primary Goal**: Build a secure, scalable authentication system that can serve as the backbone for a job marketplace platform
- **User Management**: Enable users to create accounts, authenticate securely, and access protected resources
- **Security First**: Implement JWT-based authentication with encrypted password storage
- **Modern Architecture**: Utilize contemporary web technologies and best practices for maintainability and scalability

### Target Audience
- Job seekers looking for a secure platform to manage their profiles
- Employers seeking to post job listings and manage applications
- Developers looking for a reference implementation of full-stack authentication

### Key Features
1. **User Registration System**
   - Email-based account creation
   - Password strength validation
   - Duplicate account prevention

2. **Authentication System**
   - Secure login with JWT tokens
   - Token-based session management (7-day expiry)
   - Automatic token refresh mechanism

3. **Protected Resources**
   - Role-based access control
   - Middleware-protected API endpoints
   - Client-side route protection

4. **User Dashboard**
   - Personalized user interface
   - Profile management
   - Session management

### Technical Architecture
- **Backend**: RESTful API built with Node.js and Express.js
- **Database**: MongoDB with Mongoose ODM for flexible data modeling
- **Frontend**: React.js with modern hooks and routing
- **Security**: bcryptjs for password hashing, JWT for stateless authentication
- **Deployment**: Docker containerization for consistent environments

### Success Metrics
- Successful user registration and login flows
- Secure token generation and validation
- Protected route access control
- Responsive UI across devices
- Zero security vulnerabilities in authentication flow

### Future Enhancements
- Job posting and application management
- Advanced search and filtering
- Real-time notifications
- Email verification
- OAuth integration (Google, LinkedIn)
- Two-factor authentication
- Admin dashboard for user management

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Mac/Linux
cd /Users/adarshvashistha/Desktop/Capstone_3/JOB-BAZAR
chmod +x setup.sh
./setup.sh

# Windows
setup.bat
```

### Option 2: Manual Setup
```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Option 3: Docker
```bash
docker-compose up
```

## 📋 Features

- ✅ User Registration (Signup)
- ✅ User Authentication (Login)
- ✅ JWT Token Generation (7-day expiry)
- ✅ Secure Password Hashing (bcryptjs)
- ✅ Protected Routes (Backend & Frontend)
- ✅ MongoDB Database Integration
- ✅ Responsive UI Design
- ✅ Error Handling & Validation
- ✅ CORS Support
- ✅ Docker Containerization

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling
- **Vite** - Build tool

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration

## 📁 Project Structure

```
JOB-BAZAR/
├── backend/
│   ├── config/           (Database configuration)
│   ├── controllers/      (Authentication logic)
│   ├── middleware/       (JWT middleware)
│   ├── models/          (MongoDB schemas)
│   ├── routes/          (API endpoints)
│   └── server.js        (Main server file)
│
├── frontend/
│   ├── public/          (Static files)
│   ├── src/
│   │   ├── components/  (React components)
│   │   ├── pages/      (Login, Signup, Dashboard)
│   │   └── utils/      (API client)
│   └── package.json
│
├── docker-compose.yml
├── setup.sh
├── setup.bat
└── README.md
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/logout` - Logout user

## ⚙️ Running the Application

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📦 Dependencies

### Backend Dependencies
- express
- mongoose
- jwt
- bcryptjs
- cors
- dotenv

### Frontend Dependencies
- react
- react-dom
- react-router-dom
- axios

## 🔒 Security Features

- ✓ Passwords hashed with bcryptjs (10 salt rounds)
- ✓ JWT token authentication
- ✓ Protected API routes with middleware
- ✓ Input validation on server
- ✓ Unique email constraint in database
- ✓ CORS protection
- ✓ Password confirmation on signup
- ✓ Secure token storage & transmission

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account for cloud database (https://www.mongodb.com/cloud/atlas)
- Vercel CLI (optional): `npm i -g vercel`

### Step 1: Setup MongoDB Atlas
1. Create a free MongoDB Atlas cluster
2. Get your connection string (replace `<password>` with your actual password)
3. Whitelist all IPs (0.0.0.0/0) for Vercel serverless functions

### Step 2: Deploy Backend API
```bash
cd backend
vercel
```

**Configure Environment Variables in Vercel Dashboard:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A secure random string (e.g., use `openssl rand -base64 32`)
- `CORS_ORIGIN` - Your frontend Vercel URL (e.g., https://your-app.vercel.app)
- `NODE_ENV` - Set to `production`

**Or use Vercel CLI:**
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CORS_ORIGIN
vercel env add NODE_ENV
```

### Step 3: Deploy Frontend
```bash
cd frontend
vercel
```

**Configure Environment Variables:**
- `VITE_API_URL` - Your backend Vercel URL (e.g., https://your-api.vercel.app)

**Or use Vercel CLI:**
```bash
vercel env add VITE_API_URL
```

### Step 4: Update CORS Settings
After deploying frontend, update the backend's `CORS_ORIGIN` environment variable with your frontend URL.

### Step 5: Redeploy Backend
```bash
cd backend
vercel --prod
```

### Vercel Dashboard Deployment (Alternative)
1. **Import Project**: Go to Vercel Dashboard → New Project → Import Git Repository
2. **Deploy Backend**:
   - Select `backend` folder as root directory
   - Add environment variables
   - Deploy
3. **Deploy Frontend**:
   - Select `frontend` folder as root directory
   - Add environment variables
   - Deploy

### Testing Your Deployment
1. Visit your frontend URL
2. Test signup and login functionality
3. Check browser console for any errors
4. Verify API calls are reaching your backend

### Troubleshooting
- **CORS errors**: Ensure `CORS_ORIGIN` in backend matches your frontend URL exactly
- **Database connection**: Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- **Environment variables**: Check all variables are set in Vercel dashboard
- **Build errors**: Check Vercel deployment logs for specific errors

## 🚀 Other Deployment Options

- Local (Docker Compose)
- Heroku (Cloud PaaS)
- AWS (EC2, S3, CloudFront)
- DigitalOcean (Droplet)
- Railway + Netlify

## ✅ Success Checklist

After setting up, verify:
- ☐ Backend starts without errors
- ☐ Frontend loads in browser
- ☐ Create a new user account
- ☐ Login with email/password
- ☐ View user dashboard
- ☐ Logout successfully
- ☐ Cannot access dashboard without login
- ☐ Forms validate input
- ☐ Error messages display correctly

## 🆘 Troubleshooting

### MongoDB not starting
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
mongod

# Or use MongoDB Atlas cloud service
```

### Port 5000/3000 in use
```bash
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:3000)
```

### npm install fails
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### CORS error
Check `CORS_ORIGIN` in `backend/.env` matches frontend URL

## 📊 Project Statistics

- **Total Files:** 31+
- **Lines of Code:** 2000+
- **Backend Files:** 9
- **Frontend Files:** 12
- **API Endpoints:** 4
- **Pages:** 3

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobbazar
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## 🎯 Next Steps

1. **Get Running** - Run setup.sh or setup.bat
2. **Start Services** - Start backend and frontend
3. **Test Features** - Test signup, login, and dashboard
4. **Explore Code** - Review the codebase structure
5. **Extend** - Add new features as needed

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For questions or issues:
1. Check the documentation files
2. Review code comments
3. Search online solutions
4. Check Stack Overflow

---

**Happy coding! 🎉**
