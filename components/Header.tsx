'use client'

import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'Welcome', href: '#welcome' },
    { 
      name: 'About', 
      href: '#about',
      submenu: [
        { name: 'Introduction', href: '#introduction' },
        { name: 'Our Team & Coaches', href: '#team' },
        { name: 'Locations', href: '#locations' }
      ]
    },
    { name: 'Classes', href: '#classes' },
    { name: 'News', href: '#news' },
    { name: 'Contact', href: '#contact' }
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white hover:shadow-xl transition-shadow duration-300">
              <img
                src="/img/logo.jpg"
                alt="Singapore Akira Taekwondo Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent">
              Akira X Taekwondo
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center max-w-md mx-4 flex-1">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for:"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <div key={item.name} className="relative group">
                <a
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-all duration-300 relative hover:-translate-y-0.5"
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors rounded-lg mx-2 hover:translate-x-1 transition-transform duration-200"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-br from-gray-50 to-primary-50 rounded-b-2xl border-t border-gray-100">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search for:"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              
              {navItems.map((item, index) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-700 hover:text-primary-600 block px-4 py-3 text-base font-medium rounded-xl hover:bg-white/60 transition-all duration-200 hover:translate-x-2"
                  >
                    {item.name}
                  </a>
                  {item.submenu && (
                    <div className="pl-6 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="text-gray-600 hover:text-primary-600 block px-4 py-2 text-sm rounded-lg hover:bg-white/40 transition-all duration-200 hover:translate-x-1"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}