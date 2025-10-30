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
  organizationId: {
    _id: string
    name: string
  }
}

export default function BrowseProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [user, setUser] = useState<any>(null)
  const [appliedProjects, setAppliedProjects] = useState<Set<string>>(new Set())

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchProjects()
    fetchApplications(parsedUser._id)
  }, [router])

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects')
      const data = await response.json()
      if (Array.isArray(data)) {
        setProjects(data)
        setFilteredProjects(data)
      } else {
        setProjects([])
        setFilteredProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
      setFilteredProjects([])
    }
  }

  const fetchApplications = async (userId: string) => {
    try {
      if (!userId) {
        console.error('User ID is undefined')
        return
      }
      
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/applications/volunteer/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      // Ensure data is an array before mapping
      if (Array.isArray(data)) {
        const applied = new Set<string>(data.map((app: any) => String(app.projectId._id)))
        setAppliedProjects(applied)
      } else {
        console.error('Applications data is not an array:', data)
        setAppliedProjects(new Set())
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      setAppliedProjects(new Set())
    }
  }

  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (locationFilter) {
      filtered = filtered.filter(project =>
        project.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    setFilteredProjects(filtered)
  }, [searchTerm, locationFilter, projects])

  const handleApply = async (projectId: string) => {
    try {
      if (!user || !user._id) {
        alert('Please login again')
        router.push('/login')
        return
      }

      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          volunteerId: user._id,
          projectId
        })
      })

      if (response.ok) {
        alert('Application submitted successfully!')
        setAppliedProjects(prev => new Set(prev).add(projectId))
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to apply')
      }
    } catch (error) {
      console.error('Error applying:', error)
      alert('Failed to apply')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const locations = [...new Set(projects.map(p => p.location))]

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
              className="block px-4 py-3 bg-green-50 text-green-600 rounded-lg font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Projects</h1>
          <p className="text-gray-600">Find volunteer opportunities that match your interests</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No projects found matching your criteria
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">
                    📍 {project.location}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    🏢 {project.organizationId?.name || 'Organizer'}
                  </div>
                  {project.skillsRequired && project.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.skillsRequired.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleApply(project._id)}
                  disabled={appliedProjects.has(project._id)}
                  className={`w-full py-2 rounded-lg font-medium ${
                    appliedProjects.has(project._id)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {appliedProjects.has(project._id) ? '✓ Already Applied' : 'Apply Now'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
