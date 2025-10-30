'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface Application {
  _id: string
  volunteerId: {
    _id: string
    name: string
    email: string
    skills: string[]
    location: string
  }
  projectId: {
    _id: string
    title: string
  }
  status: string
  appliedAt: string
}

interface Project {
  _id: string
  title: string
}

export default function ManageVolunteers() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [applications, setApplications] = useState<Application[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    fetchProjects(parsedUser._id)

    // Check if projectId is in URL
    const projectId = searchParams.get('projectId')
    if (projectId) {
      setSelectedProject(projectId)
      fetchApplications(projectId)
    }
  }, [router, searchParams])

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
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchApplications = async (projectId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setApplications(data)
      } else {
        setApplications([])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setApplications([])
    }
  }

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId)
    if (projectId) {
      fetchApplications(projectId)
    } else {
      setApplications([])
    }
  }

  const handleUpdateStatus = async (applicationId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        alert(`Application ${status} successfully!`)
        // Refresh applications
        if (selectedProject) {
          fetchApplications(selectedProject)
        }
      } else {
        alert('Failed to update application')
      }
    } catch (error) {
      console.error('Error updating application:', error)
      alert('Failed to update application')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

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
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              ➕ Add Project
            </Link>
            <Link 
              href="/dashboard/organizer/volunteers" 
              className="block px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Volunteers</h1>
          <p className="text-gray-600">Review and manage volunteer applications</p>
        </div>

        {/* Project Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Select a project --</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {selectedProject && (
          <>
            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({applications.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pending ({applications.filter(a => a.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilter('accepted')}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    filter === 'accepted'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Accepted ({applications.filter(a => a.status === 'accepted').length})
                </button>
                <button
                  onClick={() => setFilter('rejected')}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    filter === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Rejected ({applications.filter(a => a.status === 'rejected').length})
                </button>
              </div>
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600">No applications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app._id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold text-blue-600">
                              {app.volunteerId?.name?.charAt(0) || 'V'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {app.volunteerId?.name || 'Volunteer'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {app.volunteerId?.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-sm text-gray-500">Location:</span>
                            <p className="text-gray-900">
                              {app.volunteerId?.location || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Applied:</span>
                            <p className="text-gray-900">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {app.volunteerId?.skills && app.volunteerId.skills.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-500 mb-2 block">Skills:</span>
                            <div className="flex flex-wrap gap-2">
                              {app.volunteerId.skills.map((skill, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium text-center ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        
                        {app.status === 'pending' && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'accepted')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app._id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
