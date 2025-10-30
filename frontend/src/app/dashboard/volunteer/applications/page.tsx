'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Application {
  _id: string
  projectId: {
    _id: string
    title: string
    description: string
    location: string
    organizationId: {
      name: string
    }
  }
  status: string
  appliedAt: string
}

export default function MyApplications() {
  const router = useRouter()
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
    fetchApplications(parsedUser._id)
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

  const handleCancelApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to cancel this application?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Application cancelled successfully')
        setApplications(prev => prev.filter(app => app._id !== applicationId))
      } else {
        alert('Failed to cancel application')
      }
    } catch (error) {
      console.error('Error cancelling application:', error)
      alert('Failed to cancel application')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const filteredApplications = Array.isArray(applications) 
    ? applications.filter(app => {
        if (filter === 'all') return true
        return app.status === filter
      })
    : []

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

          <nav className="space-y-2">
            <Link 
              href="/dashboard/volunteer" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
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
              className="block px-4 py-3 bg-green-50 text-green-600 rounded-lg font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your volunteer applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
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
            <p className="text-gray-600 mb-4">No applications found</p>
            <Link 
              href="/dashboard/volunteer/browse"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {app.projectId?.title || 'Project'}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {app.projectId?.description || 'No description'}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📍 {app.projectId?.location}</span>
                      <span>🏢 {app.projectId?.organizationId?.name || 'Organizer'}</span>
                      <span>📅 Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    {app.status === 'pending' && (
                      <button
                        onClick={() => handleCancelApplication(app._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel Application
                      </button>
                    )}
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
