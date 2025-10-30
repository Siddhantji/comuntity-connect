'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  _id: string
  name: string
  role: string
}

interface Project {
  _id: string
  title: string
  location: string
}

export default function OrganizerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [totalApplications, setTotalApplications] = useState(0)
  const [pendingApplications, setPendingApplications] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'organization') {
      router.push('/dashboard/volunteer')
      return
    }

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
      setProjects(data)

      // Fetch applications for all projects
      let totalApps = 0
      let pendingApps = 0
      for (const project of data) {
        const appResponse = await fetch(`http://localhost:5000/api/projects/${project._id}/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const apps = await appResponse.json()
        totalApps += apps.length
        pendingApps += apps.filter((app: any) => app.status === 'pending').length
      }
      setTotalApplications(totalApps)
      setPendingApplications(pendingApps)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

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
          
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blue-600">{user.name.charAt(0)}</span>
            </div>
            <p className="text-center font-semibold text-gray-900">{user.name}</p>
            <p className="text-center text-sm text-gray-500 capitalize">Organizer</p>
          </div>

          <nav className="space-y-2">
            <Link 
              href="/dashboard/organizer" 
              className="block px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Here's your organizer dashboard overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">My Projects</span>
              <span className="text-3xl">📁</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Applications</span>
              <span className="text-3xl">📋</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{totalApplications}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Pending Reviews</span>
              <span className="text-3xl">⏳</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{pendingApplications}</div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
            <Link 
              href="/dashboard/organizer/projects"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">You haven't created any projects yet</p>
              <Link 
                href="/dashboard/organizer/add-project"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500">📍 {project.location}</p>
                  </div>
                  <Link
                    href={`/dashboard/organizer/projects`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Manage →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <p className="mb-6 text-blue-50">
              Post a new volunteer opportunity and find passionate volunteers for your cause.
            </p>
            <Link 
              href="/dashboard/organizer/add-project"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Add Project →
            </Link>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-md p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Manage Volunteers</h2>
            <p className="mb-6 text-green-50">
              Review applications and manage volunteers for your projects.
            </p>
            <Link 
              href="/dashboard/organizer/volunteers"
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-semibold"
            >
              View Applications →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
