import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              Compare<span className="text-gray-900">Genius</span>
            </span>
            <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-primary-700 bg-primary-100 rounded">
              PRO
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link
              to="/compare"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Compare
            </Link>
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
