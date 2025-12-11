export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About ValoMondo.info</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              ValoMondo.info is dedicated to providing comprehensive, reliable, and authentic reviews 
              and information about everything in Bangladesh. From products and services to places and 
              professionals, we aim to help people make informed decisions by connecting them with 
              real experiences and detailed information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform allows users to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Discover detailed information about products, services, places, and professionals</li>
              <li>Read authentic reviews from real users</li>
              <li>Share their own experiences and insights</li>
              <li>Compare prices, features, and ratings</li>
              <li>Find the best options for their needs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Authenticity</h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe in genuine, honest reviews that help people make better decisions. 
                  Our moderation team ensures that all content meets our quality standards.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Transparency</h3>
                <p className="text-gray-700 leading-relaxed">
                  We provide clear information about our review process and maintain transparency 
                  in how we operate and moderate content.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
                <p className="text-gray-700 leading-relaxed">
                  ValoMondo.info is built by and for the community. We encourage everyone to 
                  contribute their knowledge and experiences to help others.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Submit Items</h3>
                <p className="text-gray-700 leading-relaxed">
                  Users can submit new items (products, services, places, etc.) to our platform. 
                  All submissions are reviewed by our moderation team to ensure accuracy and quality.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Review & Rate</h3>
                <p className="text-gray-700 leading-relaxed">
                  Registered users can write detailed reviews and provide ratings based on their 
                  personal experiences. Reviews are published immediately to help others.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Discover & Decide</h3>
                <p className="text-gray-700 leading-relaxed">
                  Browse through our extensive database, read reviews, compare options, and make 
                  informed decisions based on real user experiences.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Have questions, suggestions, or feedback? We'd love to hear from you! 
              Visit our <a href="/contact" className="text-primary-600 hover:underline">Contact page</a> to get in touch.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

