'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Project {
  _id: string
  title: string
  description: string
  location: string
  skills: string[]
  volunteersNeeded: number
  organizationId: {
    name: string
  }
}

interface User {
  id: string
  name: string
  role: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyToProject = async (projectId: string) => {
    if (!user) {
      alert('Please login to apply')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          volunteerId: user.id,
          message: 'I am interested in this project'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Application submitted successfully!')
      } else {
        alert(data.error || 'Application failed')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Projects</h1>
          <div className="space-x-4">
            <Link href="/" className="text-blue-600 hover:text-blue-500">
              Home
            </Link>
            {user ? (
              <span className="text-gray-700">Welcome, {user.name}!</span>
            ) : (
              <Link href="/login" className="text-blue-600 hover:text-blue-500">
                Login
              </Link>
            )}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No projects available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-600">{project.location}</span>
                  </div>
                  
                  {project.skills && project.skills.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Skills needed:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Volunteers needed:</span>
                    <span className="ml-2 text-gray-600">{project.volunteersNeeded}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Posted by:</span>
                    <span className="ml-2 text-gray-600">
                      {project.organizationId?.name || 'Organization'}
                    </span>
                  </div>
                </div>

                {user && user.role === 'volunteer' && (
                  <button
                    onClick={() => applyToProject(project._id)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
