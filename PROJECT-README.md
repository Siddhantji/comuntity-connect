# Community Connect - Simple College Project

A basic volunteer matching platform built with MEAN stack for educational purposes.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- Git

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd community-connect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your MongoDB Atlas connection
   cp .env.example .env
   # Edit .env with your MongoDB URI
   
   # Start backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start frontend development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Application Features

### For Volunteers
- ✅ User registration and login
- ✅ Browse available community projects
- ✅ Apply to projects of interest
- ✅ View application status

### For Organizations
- ✅ Organization registration and login
- ✅ Create and post volunteer projects
- ✅ Manage project listings
- ✅ View volunteer applications

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas free tier)
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **CORS** - Cross-origin requests

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TailwindCSS** - Styling
- **TypeScript** - Type safety

## 📊 API Endpoints

### Authentication
```
POST /api/register - User registration
POST /api/login    - User login
```

### Projects
```
GET  /api/projects     - Get all projects
POST /api/projects     - Create new project (organizations only)
```

### Applications
```
POST /api/apply                - Apply to project
GET  /api/applications/:userId - Get user's applications
```

## 🧪 Testing the Application

### Manual Testing Steps

1. **Register as Organization**
   - Go to http://localhost:3000/register
   - Fill form with role "Organization"
   - Login with credentials

2. **Create a Project**
   - After logging in as organization
   - Navigate to projects page
   - Click "Create New Project"
   - Fill project details

3. **Register as Volunteer**
   - Open new browser tab/incognito
   - Register with role "Volunteer"
   - Login with volunteer credentials

4. **Apply to Project**
   - View projects list
   - Click "Apply Now" on any project
   - Verify application submission

### API Testing with curl

```bash
# Test registration
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "volunteer"
  }'

# Test login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Test projects list
curl -X GET http://localhost:5000/api/projects
```

## 📁 Project Structure

```
community-connect/
├── backend/
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   ├── .env               # Environment variables
│   └── setup-database.js  # Database setup script
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx           # Home page
│   │       ├── login/page.tsx     # Login page
│   │       ├── register/page.tsx  # Registration page
│   │       └── projects/page.tsx  # Projects page
│   ├── package.json        # Dependencies
│   └── tailwind.config.js  # Styling configuration
└── README.md
```

## 🎯 Key Features Implemented

### ✅ Completed Features
- User authentication (register/login)
- Role-based access (volunteer/organization)
- Project listing and creation
- Volunteer application system
- Responsive UI with TailwindCSS
- MongoDB integration
- RESTful API design

### 🔧 Simple Architecture
- Single-file backend for easy understanding
- Clean separation of concerns
- Environment-based configuration
- Error handling and validation

## 📝 Environment Configuration

Create `.env` file in backend directory:

```env
# MongoDB Connection (Atlas free tier)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/community-connect

# JWT Secret for authentication
JWT_SECRET=your-secret-key-here

# Server Port
PORT=5000
```

## 🎓 Educational Value

This project demonstrates:
- Full-stack web development with MEAN stack
- Database design and relationships
- RESTful API development
- Frontend-backend integration
- Authentication and authorization
- Responsive web design
- Version control with Git

## 🚀 Future Enhancements

For advanced learning, consider adding:
- Email notifications
- File upload functionality
- Advanced search and filtering
- User profiles with avatars
- Project categories and tags
- Deployment to AWS EC2
- Automated testing

## 📋 College Project Submission

This project satisfies the requirements for:
- Full-stack web application development
- Database integration and design
- Modern web technologies implementation
- Practical problem-solving approach
- Clean code and documentation

---

**Note**: This is a simplified version designed for educational purposes. For production use, additional security measures, error handling, and features would be required.