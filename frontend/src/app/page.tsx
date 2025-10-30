'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Project {
  _id: string
  title: string
  description: string
  location: string
  organizationId: {
    name: string
  }
}

interface Stats {
  totalVolunteers: number
  totalProjects: number
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<Stats>({ totalVolunteers: 0, totalProjects: 0 })

  useEffect(() => {
    fetchFeaturedProjects()
    fetchStats()
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects')
      const data = await response.json()
      setFeaturedProjects(data.slice(0, 3))
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CC</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Community Connect</span>
          </div>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Connecting Volunteers with Communities
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Join hands to make a difference. Find volunteer opportunities or list your community projects.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/register" 
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 font-semibold text-lg"
          >
            Become a Volunteer
          </Link>
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg"
          >
            List a Project
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {stats.totalVolunteers}+
            </div>
            <div className="text-xl text-gray-600">Volunteers</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-5xl font-bold text-green-600 mb-2">
              {stats.totalProjects}+
            </div>
            <div className="text-xl text-gray-600">Active Projects</div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {featuredProjects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  📍 {project.location}
                </span>
                <span className="text-sm text-gray-500">
                  By {project.organizationId?.name || 'Organizer'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link 
            href="/projects" 
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
          >
            View All Projects →
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-blue-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            About Community Connect
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Community Connect is a platform designed to bridge the gap between volunteers 
            and organizations. We make it easy for passionate individuals to find meaningful 
            volunteer opportunities and for organizations to connect with dedicated volunteers 
            who want to make a difference in their communities.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>&copy; 2025 Community Connect - A College Project</p>
        </div>
      </footer>
    </div>
  )
}
