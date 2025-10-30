'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddProject() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    skillsRequired: [] as string[]
  })
  const [newSkill, setNewSkill] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const token = localStorage.getItem('token')

      // Validate user has _id
      if (!user._id) {
        alert('User not logged in properly. Please login again.')
        router.push('/login')
        return
      }

      const projectData = {
        ...formData,
        organizationId: user._id
      }

      console.log('Sending project data:', projectData)

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      })

      const data = await response.json()
      console.log('Response:', data)

      if (response.ok) {
        alert('Project created successfully!')
        router.push('/dashboard/organizer/projects')
      } else {
        alert(data.error || data.message || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project: ' + error)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Community Connect</span>
          </div>

          <nav className="space-y-2">
            <Link 
              href="/dashboard/organizer" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              📊 Overview
            </Link>
            <Link 
              href="/dashboard/organizer/projects" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              📁 My Projects
            </Link>
            <Link 
              href="/dashboard/organizer/add-project" 
              className="block px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              ➕ Add Project
            </Link>
            <Link 
              href="/dashboard/organizer/volunteers" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              👥 Manage Volunteers
            </Link>
            <Link 
              href="/dashboard/organizer/profile" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              👤 Profile
            </Link>
          </nav>

          <button 
            onClick={handleLogout}
            className="absolute bottom-6 left-6 right-6 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Project</h1>
          <p className="text-gray-600">Create a new volunteer opportunity</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Beach Cleanup Drive"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={5}
                placeholder="Describe your volunteer project..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mumbai"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              {formData.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skillsRequired.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Project
              </button>
              <Link
                href="/dashboard/organizer"
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
