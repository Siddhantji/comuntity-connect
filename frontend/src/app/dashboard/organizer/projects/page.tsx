'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Project {
  _id: string
  title: string
  description: string
  location: string
  skillsRequired: string[]
  volunteersNeeded: number
  status: string
  createdAt: string
}

export default function MyProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchProjects(parsedUser._id)
  }, [router])

  const fetchProjects = async (organizerId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/projects/organizer/${organizerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setProjects(data)
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? All applications will also be deleted.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Project deleted successfully')
        setProjects(prev => prev.filter(p => p._id !== projectId))
      } else {
        alert('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
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
              className="block px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              📁 My Projects
            </Link>
            <Link 
              href="/dashboard/organizer/add-project" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
              <p className="text-gray-600">Manage all your volunteer projects</p>
            </div>
            <Link 
              href="/dashboard/organizer/add-project"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              ➕ Add New Project
            </Link>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-600 mb-4">You haven't created any projects yet</p>
            <Link 
              href="/dashboard/organizer/add-project"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {project.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span>📍 {project.location}</span>
                      <span>👥 {project.volunteersNeeded} volunteers needed</span>
                      <span>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    {project.skillsRequired && project.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.skillsRequired.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <Link
                      href={`/dashboard/organizer/volunteers?projectId=${project._id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium text-center"
                    >
                      View Applications
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
