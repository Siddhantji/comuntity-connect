'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  name: string
  role: string
  skills: string[]
}

interface Application {
  _id: string
  projectId: {
    _id: string
    title: string
    organizationId: {
      name: string
    }
  }
  status: string
  appliedAt: string
}

export default function VolunteerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [totalProjects, setTotalProjects] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'volunteer') {
      router.push('/dashboard/organizer')
      return
    }

    setUser(parsedUser)
    fetchApplications(parsedUser._id)
    fetchTotalProjects()
  }, [router])

  const fetchApplications = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/applications/volunteer/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      // Ensure data is an array
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

  const fetchTotalProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects')
      const data = await response.json()
      setTotalProjects(data.length)
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

  const pendingApps = Array.isArray(applications) ? applications.filter(app => app.status === 'pending').length : 0
  const acceptedApps = Array.isArray(applications) ? applications.filter(app => app.status === 'accepted').length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Community Connect</span>
          </div>
          
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-green-600">{user.name.charAt(0)}</span>
            </div>
            <p className="text-center font-semibold text-gray-900">{user.name}</p>
            <p className="text-center text-sm text-gray-500 capitalize">{user.role}</p>
          </div>

          <nav className="space-y-2">
            <Link 
              href="/dashboard/volunteer" 
              className="block px-4 py-3 bg-green-50 text-green-600 rounded-lg font-medium"
            >
              📊 Overview
            </Link>
            <Link 
              href="/dashboard/volunteer/browse" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              🔍 Browse Projects
            </Link>
            <Link 
              href="/dashboard/volunteer/applications" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
            >
              📝 My Applications
            </Link>
            <Link 
              href="/dashboard/volunteer/profile" 
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
          <p className="text-gray-600">Here's your volunteer dashboard overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Applications</span>
              <span className="text-3xl">📋</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Pending</span>
              <span className="text-3xl">⏳</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{pendingApps}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Accepted</span>
              <span className="text-3xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{acceptedApps}</div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">You haven't applied to any projects yet</p>
              <Link 
                href="/dashboard/volunteer/browse"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div key={app._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {app.projectId?.title || 'Project'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      By {app.projectId?.organizationId?.name || 'Organizer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-md p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="mb-6 text-green-50">
            Browse {totalProjects} available volunteer opportunities and apply to projects that match your skills.
          </p>
          <Link 
            href="/dashboard/volunteer/browse"
            className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-semibold"
          >
            Browse Projects →
          </Link>
        </div>
      </div>
    </div>
  )
}
