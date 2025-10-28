# Community Connect - Simple Setup Guide

## 🚀 Quick Start Guide for College Project

### Prerequisites
- Node.js installed (v18 or higher)
- MongoDB Atlas account (free tier) OR local MongoDB

---

## 📁 Project Structure

```
community-connect/
├── backend/           # Node.js + Express API
│   ├── server.js     # Main server file (all code in one file)
│   ├── .env          # Environment variables
│   └── package.json
│
├── frontend/          # Next.js Frontend
│   ├── src/app/      # Pages
│   │   ├── page.tsx        # Home page
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   └── projects/       # Projects listing
│   └── package.json
│
└── FINAL-REPORT-SIMPLE.md  # Your final report
```

---

## ⚙️ Backend Setup

### 1. Navigate to backend folder
```powershell
cd "d:\comuntity connect\backend"
```

### 2. Install dependencies (already done)
```powershell
npm install
```

### 3. Check .env file
Your `.env` file should have:
```
MONGODB_URI=mongodb+srv://teotiasiddhant:%24iddsCompany953@cluster0.iip1gmg.mongodb.net/community?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
PORT=5000
```

### 4. Start backend server
```powershell
npm run dev
```

✅ Backend will run on: **http://localhost:5000**

---

## 🎨 Frontend Setup

### 1. Open NEW terminal and navigate to frontend
```powershell
cd "d:\comuntity connect\frontend"
```

### 2. Dependencies already installed
Already done with `npm install`

### 3. Start frontend server
```powershell
npm run dev
```

✅ Frontend will run on: **http://localhost:3000**

---

## 🧪 Testing the Application

### 1. Open browser
Go to: **http://localhost:3000**

### 2. Register a new user
- Click "Register"
- Fill form:
  - Name: Test User
  - Email: test@example.com
  - Password: password123
  - Role: Choose "Volunteer" or "Organization"
  - Location: Bangalore, India
  - Skills: Web Development, Teaching

### 3. Login
- Use email and password you registered
- You'll be redirected to projects page

### 4. View Projects
- Browse available projects
- If you're a volunteer, you can apply to projects

---

## 📝 Simple API Endpoints

### Authentication
- **POST** `/api/register` - Register new user
- **POST** `/api/login` - Login user

### Projects
- **GET** `/api/projects` - Get all active projects
- **POST** `/api/projects` - Create new project (organization only)

### Applications
- **POST** `/api/apply` - Apply to a project (volunteer only)
- **GET** `/api/applications/:userId` - Get user's applications

---

## 🔧 Common Issues & Solutions

### Issue 1: Backend won't start
**Error:** "npm run dev" fails

**Solution:**
```powershell
# Stop any running process on port 5000
# Then restart
cd "d:\comuntity connect\backend"
npm run dev
```

### Issue 2: Frontend won't start
**Error:** Port 3000 already in use

**Solution:**
```powershell
# Kill process on port 3000, then:
cd "d:\comuntity connect\frontend"
npm run dev
```

### Issue 3: Cannot connect to MongoDB
**Error:** "MongoDB connection error"

**Solution:**
- Check `.env` file has correct MONGODB_URI
- Ensure MongoDB Atlas cluster is running
- Check internet connection

### Issue 4: CORS errors
**Error:** "CORS policy blocked"

**Solution:**
- Ensure backend is running on port 5000
- Frontend should use `http://localhost:5000/api/...`
- CORS is already configured in `server.js`

---

## 📸 Screenshots for Report

### What to capture for your report:

1. **AWS Console**
   - EC2 Dashboard (with Account ID visible)
   - S3 Buckets page (with Account ID visible)

2. **Application Pages**
   - Home page
   - Registration form
   - Login page
   - Projects listing
   - User dashboard

3. **MongoDB Atlas**
   - Cluster overview
   - Database collections

---

## 🎓 For College Submission

### Files to submit:
1. **Code:** Entire `community-connect` folder
2. **Report:** `FINAL-REPORT-SIMPLE.md` (fill in your details)
3. **Screenshots:** As mentioned above
4. **Video:** Optional demo video

### Before submission:
- [ ] Fill in your name and USN in report
- [ ] Add guide's name in report
- [ ] Take all required screenshots with AWS Account ID
- [ ] Test login, registration, and project viewing
- [ ] Ensure backend and frontend run without errors

---

## 💡 Features Implemented

✅ **User Authentication**
- Registration with role selection (volunteer/organization)
- Login with JWT tokens
- Password hashing with BCrypt

✅ **Project Management**
- Organizations can create projects
- Projects have title, description, location, skills
- Status management (active/closed)

✅ **Volunteer Features**
- Browse all active projects
- Filter by skills and location
- Apply to projects
- View application status

✅ **Tech Stack**
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, BCrypt
- **Cloud:** Ready for AWS EC2, S3 deployment

---

## 🚀 Running Both Servers

### Option 1: Two terminals
Terminal 1:
```powershell
cd "d:\comuntity connect\backend"
npm run dev
```

Terminal 2:
```powershell
cd "d:\comuntity connect\frontend"
npm run dev
```

### Option 2: VS Code
- Use VS Code's integrated terminal
- Split terminal (Ctrl + Shift + 5)
- Run backend in one, frontend in other

---

## 📚 Additional Resources

- Next.js Docs: https://nextjs.org/docs
- Express.js Docs: https://expressjs.com/
- MongoDB Docs: https://www.mongodb.com/docs/
- AWS Free Tier: https://aws.amazon.com/free/

---

## ✅ Checklist Before Demo

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] MongoDB connection working
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can view projects
- [ ] Can apply to projects (as volunteer)
- [ ] All pages load without errors

---

**Good luck with your project presentation! 🎉**

---

*For any issues, check the terminal logs for error messages and refer to the troubleshooting section above.*
