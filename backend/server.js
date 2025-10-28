const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-connect')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Simple Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['volunteer', 'organization'], default: 'volunteer' },
  skills: [String],
  location: String,
  createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  skillsRequired: [String],
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volunteersNeeded: { type: Number, default: 1 },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  message: String,
  appliedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Application = mongoose.model('Application', applicationSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Community Connect API - Simple College Project',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/register',
      login: 'POST /api/login',
      projects: 'GET/POST /api/projects',
      apply: 'POST /api/apply'
    }
  });
});

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role, skills, location } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      skills: skills || [],
      location
    });

    await user.save();
    
    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { 
        _id: user._id, 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        skills: user.skills,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { 
        _id: user._id,
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        skills: user.skills,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'active' }).populate('organizationId', 'name');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, location, skillsRequired, organizationId, volunteersNeeded } = req.body;
    
    // Validate required fields
    if (!title || !description || !location || !organizationId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate organizationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ error: 'Invalid organization ID' });
    }
    
    const project = new Project({
      title,
      description,
      location,
      skillsRequired: skillsRequired || [],
      organizationId,
      volunteersNeeded: volunteersNeeded || 1
    });
    
    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Apply to project (both routes for compatibility)
app.post('/api/apply', async (req, res) => {
  try {
    const { projectId, volunteerId, message } = req.body;
    
    // Check if already applied
    const existingApplication = await Application.findOne({ projectId, volunteerId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this project' });
    }
    
    const application = new Application({ projectId, volunteerId, message });
    await application.save();
    
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create application (new route for dashboard)
app.post('/api/applications', async (req, res) => {
  try {
    const { projectId, volunteerId, message } = req.body;
    
    // Check if already applied
    const existingApplication = await Application.findOne({ projectId, volunteerId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this project' });
    }
    
    const application = new Application({ projectId, volunteerId, message });
    await application.save();
    
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications for a volunteer
app.get('/api/applications/volunteer/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ volunteerId: userId })
      .populate({
        path: 'projectId',
        populate: { path: 'organizationId', select: 'name' }
      })
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications for a user (old route for compatibility)
app.get('/api/applications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ volunteerId: userId })
      .populate('projectId', 'title description location')
      .populate('volunteerId', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications for a project (for organizers)
app.get('/api/projects/:projectId/applications', async (req, res) => {
  try {
    const { projectId } = req.params;
    const applications = await Application.find({ projectId })
      .populate('volunteerId', 'name email skills location');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get projects by organizer
app.get('/api/projects/organizer/:organizerId', async (req, res) => {
  try {
    const { organizerId } = req.params;
    const projects = await Project.find({ organizationId: organizerId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status (accept/reject)
app.patch('/api/applications/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete application (cancel)
app.delete('/api/applications/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    await Application.findByIdAndDelete(applicationId);
    res.json({ message: 'Application cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
app.put('/api/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, location, skillsRequired, volunteersNeeded } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      projectId,
      { title, description, location, skillsRequired, volunteersNeeded },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
app.delete('/api/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    await Project.findByIdAndDelete(projectId);
    await Application.deleteMany({ projectId });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, location, skills } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { name, location, skills },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user object with _id field
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      location: user.location
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const totalProjects = await Project.countDocuments({ status: 'active' });
    res.json({ totalVolunteers, totalProjects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Simple Community Connect API ready for college project');
});