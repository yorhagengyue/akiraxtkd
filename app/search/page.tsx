/**
 * Search Page
 * 全站搜索功能
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Calendar, BookOpen, FileText, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedPage from '@/components/animations/AnimatedPage';
import { LoadingPage } from '@/components/ui/Loading';
import { EmptySearchResults } from '@/components/ui/EmptyStates';

interface SearchResult {
  id: string;
  type: 'class' | 'pattern' | 'news' | 'page';
  title: string;
  description: string;
  url: string;
  metadata?: {
    date?: string;
    location?: string;
    instructor?: string;
    belt?: string;
  };
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock搜索数据
  const mockSearchData: SearchResult[] = [
    // Classes
    {
      id: 'monday-class',
      type: 'class',
      title: 'Monday Evening Class',
      description: 'Technical training and belt progression for all levels at Tampines',
      url: '/classes#monday',
      metadata: {
        date: 'Monday 8:00 PM - 9:00 PM',
        location: '604 Tampines Avenue 9',
        instructor: 'Jasterfer Kellen'
      }
    },
    {
      id: 'tuesday-class',
      type: 'class',
      title: 'Tuesday Evening Session',
      description: 'Poomsae practice and sparring techniques at Compassvale',
      url: '/classes#tuesday',
      metadata: {
        date: 'Tuesday 7:30 PM - 8:30 PM',
        location: '211C Compassvale Lane',
        instructor: 'Certified Instructor'
      }
    },
    // Patterns
    {
      id: 'taeguek-il-jang',
      type: 'pattern',
      title: 'Taeguek Il Jang',
      description: 'First form in the Taeguek series - fundamental movements and stances',
      url: '/patterns/taeguek-il-jang',
      metadata: {
        belt: 'Yellow Belt'
      }
    },
    {
      id: 'taeguek-e-jang',
      type: 'pattern',
      title: 'Taeguek E Jang',
      description: 'Second form focusing on front kicks and defensive movements',
      url: '/patterns/taeguek-e-jang',
      metadata: {
        belt: 'Yellow Belt with Green Tip'
      }
    },
    // Pages
    {
      id: 'about-team',
      type: 'page',
      title: 'Our Team & Coaches',
      description: 'Meet our experienced instructors and their qualifications',
      url: '/about#team'
    },
    {
      id: 'about-awards',
      type: 'page',
      title: 'Awards & Recognition',
      description: 'Our achievements and certifications in martial arts education',
      url: '/about#awards'
    }
  ];

  // 执行搜索
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const searchTerm = searchQuery.toLowerCase();
      const filteredResults = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        (item.metadata?.instructor && item.metadata.instructor.toLowerCase().includes(searchTerm)) ||
        (item.metadata?.location && item.metadata.location.toLowerCase().includes(searchTerm)) ||
        (item.metadata?.belt && item.metadata.belt.toLowerCase().includes(searchTerm))
      );
      
      setResults(filteredResults);
      setLoading(false);
    }, 500);
  };

  // 初始搜索
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, []);

  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  // 获取图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'pattern':
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'news':
        return <FileText className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  // 获取类型标签颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800';
      case 'pattern':
        return 'bg-green-100 text-green-800';
      case 'news':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AnimatedPage>
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
            <p className="text-gray-600">
              Search for classes, patterns, news, and more
            </p>
          </div>

          {/* Search Form */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for classes, patterns, instructors..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Search Results */}
          {loading ? (
            <LoadingPage message="Searching..." />
          ) : query && results.length === 0 ? (
            <EmptySearchResults searchTerm={query} />
          ) : query && results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results ({results.length})
                </h2>
                <span className="text-sm text-gray-500">
                  for "{query}"
                </span>
              </div>

              {results.map((result) => (
                <div key={result.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(result.type)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {result.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {result.description}
                      </p>

                      {result.metadata && (
                        <div className="space-y-1 text-sm text-gray-500">
                          {result.metadata.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{result.metadata.date}</span>
                            </div>
                          )}
                          {result.metadata.location && (
                            <div className="flex items-center gap-2">
                              <span>📍</span>
                              <span>{result.metadata.location}</span>
                            </div>
                          )}
                          {result.metadata.instructor && (
                            <div className="flex items-center gap-2">
                              <span>👨‍🏫</span>
                              <span>Instructor: {result.metadata.instructor}</span>
                            </div>
                          )}
                          {result.metadata.belt && (
                            <div className="flex items-center gap-2">
                              <span>🥋</span>
                              <span>Required: {result.metadata.belt}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <a
                      href={result.url}
                      className="ml-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      View
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-600 mb-2">
                Search our content
              </h2>
              <p className="text-gray-500">
                Enter a search term above to find classes, patterns, and more
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </AnimatedPage>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingPage message="Loading search..." />}>
      <SearchPageContent />
    </Suspense>
  );
}
