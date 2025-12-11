export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-gray-700 leading-relaxed">
              At ValoMondo.info, we are committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use 
              our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you create an account, we collect information such as your name, email address, 
                  and password. This information is necessary to provide you with our services and to 
                  communicate with you.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Content You Submit</h3>
                <p className="text-gray-700 leading-relaxed">
                  We collect the reviews, ratings, comments, photos, and other content you submit to 
                  our platform. This content is publicly visible and may be used by other users.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Usage Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We automatically collect information about how you interact with our website, including 
                  pages visited, time spent on pages, and search queries. This helps us improve our services.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>To provide, maintain, and improve our services</li>
              <li>To process your account registration and manage your account</li>
              <li>To display your reviews, ratings, and other content on our platform</li>
              <li>To communicate with you about your account, our services, or important updates</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To detect, prevent, and address technical issues or fraudulent activity</li>
              <li>To analyze usage patterns and improve user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong>Public Content:</strong> Your reviews, ratings, and other public content are 
                visible to all users of our platform.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share information with third-party service 
                providers who help us operate our platform (e.g., hosting, analytics).
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information if required by law 
                or to protect our rights and the safety of our users.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale 
                of assets, your information may be transferred.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, 
              no method of transmission over the internet is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>Access and update your personal information through your account settings</li>
              <li>Delete your account and associated data</li>
              <li>Request a copy of your personal data</li>
              <li>Opt-out of certain communications</li>
              <li>Delete or edit your reviews and other content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience, analyze 
              usage, and assist with our marketing efforts. You can control cookie preferences through 
              your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 13. We do not knowingly 
              collect personal information from children under 13. If you believe we have collected 
              information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our data practices, 
              please <a href="/contact" className="text-primary-600 hover:underline">contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

