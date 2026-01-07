import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">CompareGenius Pro</h3>
            <p className="text-sm">
              AI-powered product comparisons you can trust. Make informed decisions with
              comprehensive, unbiased insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white">Search Products</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white">Compare</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/laptops" className="hover:text-white">Laptops</Link>
              </li>
              <li>
                <Link to="/category/smartphones" className="hover:text-white">Smartphones</Link>
              </li>
              <li>
                <Link to="/category/tvs" className="hover:text-white">TVs</Link>
              </li>
              <li>
                <Link to="/category/headphones" className="hover:text-white">Headphones</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2025 CompareGenius Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
