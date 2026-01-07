import { Link } from 'react-router-dom';
import { Search, Zap, Shield, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Product Comparisons
              <br />
              <span className="text-primary-600">You Can Trust</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Make informed decisions with comprehensive, unbiased product comparisons.
              Our AI analyzes thousands of products to help you find exactly what you need.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/search"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Start Comparing
              </Link>
              <Link
                to="/how-it-works"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose CompareGenius Pro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary-600" />}
              title="AI-Powered Insights"
              description="Our advanced AI analyzes product specs, reviews, and pricing to give you intelligent comparisons in seconds."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary-600" />}
              title="Unbiased & Transparent"
              description="No pay-to-win rankings. Our recommendations are based purely on data and user needs."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-primary-600" />}
              title="Real-Time Pricing"
              description="Track prices across multiple retailers and get alerts when your desired products go on sale."
            />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard name="Laptops" image="💻" />
            <CategoryCard name="Smartphones" image="📱" />
            <CategoryCard name="TVs" image="📺" />
            <CategoryCard name="Headphones" image="🎧" />
            <CategoryCard name="Cameras" image="📷" />
            <CategoryCard name="Smartwatches" image="⌚" />
            <CategoryCard name="Tablets" image="📋" />
            <CategoryCard name="Gaming" image="🎮" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make Smarter Decisions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who trust CompareGenius Pro for their purchasing decisions.
          </p>
          <Link
            to="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function CategoryCard({ name, image }: { name: string; image: string }) {
  return (
    <Link
      to={`/category/${name.toLowerCase()}`}
      className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition text-center"
    >
      <div className="text-4xl mb-2">{image}</div>
      <h3 className="font-semibold text-gray-900">{name}</h3>
    </Link>
  );
}
