# Community Connect - Quick Start 🚀

## ✅ Everything is Set Up and Ready!

Your basic Community Connect platform is ready to run. Here's what's been configured:

---

## 📦 What's Included

### Backend (Node.js + Express)
- ✅ Simple Express server in `server.js`
- ✅ MongoDB connection configured
- ✅ User registration and login (JWT + BCrypt)
- ✅ Project listing and creation
- ✅ Application submission
- ✅ All dependencies installed

### Frontend (Next.js + React)
- ✅ Home page
- ✅ Login page
- ✅ Registration page
- ✅ Projects listing page
- ✅ Responsive design with Tailwind CSS
- ✅ All dependencies installed

### Database
- ✅ MongoDB Atlas connection configured
- ✅ Collections: Users, Projects, Applications
- ✅ Simple schemas with basic validation

---

## 🏃 How to Run (2 Simple Steps)

### Step 1: Start Backend
```powershell
# Open terminal/PowerShell
cd "d:\comuntity connect\backend"
npm run dev
```
✅ Backend will start on: **http://localhost:5000**

### Step 2: Start Frontend (in NEW terminal)
```powershell
# Open another terminal
cd "d:\comuntity connect\frontend"
npm run dev
```
✅ Frontend will start on: **http://localhost:3000**

---

## 🎯 Test Your Application

1. **Open browser:** http://localhost:3000

2. **Register:**
   - Click "Register"
   - Fill in details:
     - Name: `Test User`
     - Email: `test@example.com`
     - Password: `password123`
     - Role: `Volunteer` or `Organization`
     - Location: `Bangalore, India`
     - Skills: `Teaching, Coding`

3. **Login:**
   - Use the email and password you just registered
   - You'll see the projects page

4. **View Projects:**
   - Browse available community projects
   - Apply to projects (if you're a volunteer)

---

## 📋 Sample Test Accounts

Create these accounts for testing:

**Organization Account:**
- Name: Green Earth NGO
- Email: org@example.com
- Password: password123
- Role: Organization

**Volunteer Account:**
- Name: John Volunteer
- Email: volunteer@example.com
- Password: password123
- Role: Volunteer
- Skills: Teaching, Web Development

---

## 🎨 Pages Available

1. **Home (/)** - Landing page with intro
2. **Register (/register)** - User registration
3. **Login (/login)** - User login
4. **Projects (/projects)** - Browse all projects

---

## 🔍 API Endpoints Working

### Authentication
- `POST /api/register` - Create account
- `POST /api/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project

### Applications
- `POST /api/apply` - Apply to project
- `GET /api/applications/:userId` - Get applications

---

## ⚠️ Important Notes

### For Backend:
- MongoDB connection is to your Atlas cluster
- JWT secret is set in .env file
- All code is in single `server.js` file (simple for college project)
- CORS is enabled for frontend communication

### For Frontend:
- Built with Next.js 15 and React 19
- TypeScript for type safety
- Tailwind CSS for styling
- API calls to `http://localhost:5000`

---

## 🐛 Common Issues

### Backend won't start?
- Check MongoDB connection string in `.env`
- Ensure port 5000 is not in use
- Look at terminal for error messages

### Frontend won't start?
- Ensure port 3000 is not in use
- Check if all dependencies installed
- Try: `npm install` in frontend folder

### Can't connect to API?
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify API URL is `http://localhost:5000`

### MongoDB errors?
- Check internet connection
- Verify MongoDB Atlas cluster is active
- Check .env has correct connection string

---

## 📸 Screenshots Needed for Report

Take screenshots showing:

1. **Backend running** - Terminal with "Server running on port 5000"
2. **Frontend running** - Terminal with "Ready on http://localhost:3000"
3. **Home page** - Landing page
4. **Registration form** - User registration
5. **Login page** - Authentication
6. **Projects page** - Listing of projects
7. **MongoDB Atlas** - Your database cluster
8. **VS Code** - Your code open

**Important:** For AWS screenshots, your Account ID must be visible!

---

## 📝 Report Template

Your report is ready in: **FINAL-REPORT-SIMPLE.md**

Just fill in:
- Your Name
- Your USN
- Guide's Name
- Add screenshots
- Submit!

---

## ✨ Features Implemented

✅ User registration with role selection
✅ Secure login with JWT authentication
✅ Password hashing with BCrypt
✅ Project listing and creation
✅ Volunteer application system
✅ Simple, clean UI
✅ Responsive design
✅ MongoDB database integration
✅ RESTful API architecture

---

## 🎓 Perfect for College Project!

This setup is:
- ✅ Simple enough to understand and explain
- ✅ Professional enough to impress
- ✅ Complete enough to demonstrate all concepts
- ✅ Well-documented for submission

---

## 📚 Next Steps

1. ✅ Setup complete - Everything is ready!
2. ▶️ Run backend server
3. ▶️ Run frontend server
4. 🧪 Test the application
5. 📸 Take screenshots
6. 📝 Complete the report
7. 🎉 Submit your project!

---

## 💻 Development URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/ (shows all endpoints)

---

## 🎯 Ready to Start!

Your Community Connect platform is fully configured and ready to run. 

Just execute the two commands above and start testing!

**Good luck with your project! 🚀**

---

For detailed setup instructions, see: **SETUP-GUIDE.md**
