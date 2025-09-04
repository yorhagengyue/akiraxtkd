'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Search, User, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { isAuthenticated: checkAuth, getStoredUser } = await import('@/lib/auth-client')
        
        if (checkAuth()) {
          const userData = getStoredUser()
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.error('Header auth check error:', err)
        setUser(null)
        setIsAuthenticated(false)
      }
    }

    checkAuthStatus()
    
    // 监听存储变化，当用户登录/登出时更新状态
    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // 也监听自定义事件，用于同一页面内的登录状态变化
    window.addEventListener('authStateChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleStorageChange)
    }
  }, [])

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as HTMLElement
        if (!target.closest('.user-menu-container')) {
          setShowUserMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const handleLogout = async () => {
    try {
      const { logout } = await import('@/lib/auth-client')
      await logout()
      setUser(null)
      setIsAuthenticated(false)
      setShowUserMenu(false)
      
      // 触发自定义事件通知其他组件
      window.dispatchEvent(new CustomEvent('authStateChanged'))
      
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    
    return user.role === 'admin' ? '/dashboard/admin' :
           user.role === 'coach' ? '/dashboard/coach' :
           '/dashboard/student'
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { 
      name: 'About', 
      href: '/about',
      submenu: [
        { name: 'Introduction', href: '/about' },
        { name: 'Our Team & Coaches', href: '/about#team' },
        { name: 'Locations', href: '/about#locations' }
      ]
    },
    {
      name: 'Patterns',
      href: '/patterns',
      submenu: [
        { name: 'Preliminary Poomsae', href: '/patterns/preliminary' },
        { name: 'Taeguek IL Jang', href: '/patterns/taeguek-il-jang' },
        { name: 'Taeguek E (2) Jang', href: '/patterns/taeguek-e-jang' },
        { name: 'Taeguek Sam (3) Jang', href: '/patterns/taeguek-sam-jang' },
        { name: 'Taeguek Sa (4) Jang', href: '/patterns/taeguek-sa-jang' },
        { name: 'Taeguek O (5) Jang', href: '/patterns/taeguek-o-jang' },
        { name: 'Taeguek Yuk (6) Jang', href: '/patterns/taeguek-yuk-jang' },
        { name: 'Taeguek Chil (7) Jang', href: '/patterns/taeguek-chil-jang' },
        { name: 'Taeguek Pal (8) Jang', href: '/patterns/taeguek-pal-jang' }
      ]
    },
    { name: 'Classes', href: '/classes' },
    { name: 'News', href: '/news' },
    { name: 'Contact', href: '/#contact' }
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
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const searchQuery = formData.get('search') as string;
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="relative w-full"
            >
              <input
                type="text"
                name="search"
                placeholder="Search classes, patterns..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-8">
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
            
            {/* Auth Button and Links */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{user.display_name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link
                        href={getDashboardPath()}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="text-sm text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register"
                    className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

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
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const searchQuery = formData.get('mobile-search') as string;
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                    setIsMenuOpen(false);
                  }
                }}
                className="relative mb-4"
              >
                <input
                  type="text"
                  name="mobile-search"
                  placeholder="Search classes, patterns..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </form>
              
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
              
              {/* Mobile Auth Links */}
              <div className="px-4 py-3 border-t border-gray-200 mt-4 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.display_name}</div>
                        <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                      </div>
                    </div>
                    <Link 
                      href={getDashboardPath()}
                      className="block w-full text-center py-2 px-4 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-center py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      className="block w-full text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/register"
                      className="block w-full text-center py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}