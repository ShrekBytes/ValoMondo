export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-gray-700 leading-relaxed">
              Welcome to ValoMondo.info. By accessing or using our website and services, you agree to 
              be bound by these Terms of Service. Please read these terms carefully before using our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By creating an account, accessing, or using ValoMondo.info, you acknowledge that you have 
              read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use of Service</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Eligibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 13 years old to use our services. By using our platform, you 
                  represent and warrant that you meet this age requirement and have the legal capacity 
                  to enter into these terms.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Responsibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials 
                  and for all activities that occur under your account. You agree to notify us immediately 
                  of any unauthorized use of your account.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Content</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of the content you submit to our platform (reviews, ratings, 
                  comments, photos, etc.). By submitting content, you grant us a worldwide, non-exclusive, 
                  royalty-free license to use, display, and distribute your content on our platform.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Content Guidelines</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You agree not to submit content that:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Is illegal, harmful, or violates any laws or regulations</li>
                  <li>Infringes on the rights of others (copyright, trademark, privacy, etc.)</li>
                  <li>Contains false, misleading, or deceptive information</li>
                  <li>Is spam, promotional, or commercial in nature</li>
                  <li>Is offensive, abusive, or discriminatory</li>
                  <li>Contains personal information of others without consent</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use our platform for any illegal purpose or in violation of any laws</li>
              <li>Create fake accounts or submit fake reviews</li>
              <li>Attempt to manipulate ratings or reviews through fraudulent means</li>
              <li>Interfere with or disrupt the operation of our platform</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Use automated systems (bots, scrapers) to access our platform without permission</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Moderation and Content Removal</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to review, moderate, edit, or remove any content that violates these 
              terms or our community guidelines. We may suspend or terminate accounts that repeatedly 
              violate our terms. While we strive to maintain a safe and respectful environment, we are 
              not obligated to monitor all content posted on our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The ValoMondo.info platform, including its design, features, and functionality, is owned 
              by us and protected by copyright, trademark, and other intellectual property laws. You may 
              not copy, modify, distribute, or create derivative works based on our platform without our 
              express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our platform is provided "as is" and "as available" without warranties of any kind. 
              We do not guarantee:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>The accuracy, completeness, or reliability of any content on our platform</li>
              <li>That our services will be uninterrupted, secure, or error-free</li>
              <li>That any defects will be corrected</li>
              <li>The quality or suitability of any products, services, or information reviewed on our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, ValoMondo.info and its operators shall not be 
              liable for any indirect, incidental, special, consequential, or punitive damages, or any 
              loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, 
              use, goodwill, or other intangible losses resulting from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account and access to our services at 
              any time, with or without cause or notice, for any reason, including violation of these 
              terms. You may also terminate your account at any time by contacting us or using account 
              deletion features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify users 
              of material changes by posting the updated terms on this page and updating the "Last Updated" 
              date. Your continued use of our services after such changes constitutes acceptance of the 
              updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of 
              Bangladesh, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about these Terms of Service, please 
              <a href="/contact" className="text-primary-600 hover:underline"> contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

