export default function GuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Review Guidelines</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              At ValoMondo.info, we value authentic and helpful reviews that assist others in making 
              informed decisions. To maintain the quality and integrity of our platform, please follow 
              these guidelines when writing reviews.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Guidelines</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong>Be Honest and Accurate:</strong> Share your genuine experience based on actual 
                interactions with the product, service, or place. Avoid exaggerations or false claims.
              </li>
              <li>
                <strong>Be Respectful:</strong> Use respectful language and avoid personal attacks, 
                offensive content, or discriminatory remarks.
              </li>
              <li>
                <strong>Be Relevant:</strong> Focus on aspects that are relevant to the item being reviewed. 
                Include specific details about your experience.
              </li>
              <li>
                <strong>Be Helpful:</strong> Write reviews that would be useful to others. Include both 
                positive aspects and areas for improvement when applicable.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What to Include</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Products</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Quality and durability</li>
                  <li>Value for money</li>
                  <li>Ease of use</li>
                  <li>Packaging and presentation</li>
                  <li>Comparison with similar products</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">For Services & Places</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Service quality and professionalism</li>
                  <li>Customer service experience</li>
                  <li>Cleanliness and ambiance (for places)</li>
                  <li>Pricing and value</li>
                  <li>Location and accessibility</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Not to Do</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong>No Spam or Promotional Content:</strong> Do not use reviews to promote your own 
                business, products, or services.
              </li>
              <li>
                <strong>No Fake Reviews:</strong> Do not write reviews for items you haven't actually 
                experienced or create fake accounts to boost ratings.
              </li>
              <li>
                <strong>No Personal Information:</strong> Do not share personal information about yourself 
                or others in your reviews.
              </li>
              <li>
                <strong>No Offensive Content:</strong> Avoid profanity, hate speech, or content that 
                violates community standards.
              </li>
              <li>
                <strong>No Conflicts of Interest:</strong> If you have a personal or business relationship 
                with the item being reviewed, disclose it in your review.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Photo and Video Guidelines</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>Only upload photos or videos that you own or have permission to use</li>
              <li>Ensure images are clear and relevant to your review</li>
              <li>Do not upload offensive, inappropriate, or copyrighted content</li>
              <li>Respect privacy - do not include images of people without their consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rating Guidelines</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>5 Stars:</strong> Excellent - Exceeded expectations in all aspects
              </p>
              <p>
                <strong>4 Stars:</strong> Very Good - Met expectations with minor areas for improvement
              </p>
              <p>
                <strong>3 Stars:</strong> Good - Met basic expectations, average experience
              </p>
              <p>
                <strong>2 Stars:</strong> Poor - Below expectations, significant issues
              </p>
              <p>
                <strong>1 Star:</strong> Very Poor - Failed to meet basic expectations, major problems
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Moderation</h2>
            <p className="text-gray-700 leading-relaxed">
              All reviews are published immediately, but our moderation team may review and remove 
              content that violates these guidelines. We reserve the right to remove reviews that are 
              spam, fake, offensive, or otherwise inappropriate. Users can also report reviews that 
              they believe violate our guidelines.
            </p>
          </section>

          <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need Help?</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about our review guidelines or need to report inappropriate content, 
              please <a href="/contact" className="text-primary-600 hover:underline">contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

