import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-12 border-b border-slate-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Global Privacy Policy</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Effective Date: January 1, 2025</p>
        </div>

        <div className="space-y-12 text-slate-600 leading-relaxed text-sm md:text-base">
          <section>
            <p className="mb-4 text-lg font-medium text-slate-800">
              XPND Technologies Inc. ("Parkr", "we", "us", or "our") is committed to protecting the privacy and security of your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our mobile application (collectively, the "Service").
            </p>
            <p className="mb-4">
              This policy is designed to comply with the General Data Protection Regulation (GDPR), the UK Data Protection Act 2018, the California Consumer Privacy Act (CCPA), and other applicable global privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Data Controller</h2>
            <p className="mb-4">
              For the purposes of the GDPR and UK data protection laws, the Data Controller is XPND Technologies Inc. We are responsible for your personal data and determine the purposes and means of processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">2. Information We Collect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Identity & Biometric Data</h3>
                <p className="text-xs leading-relaxed">Government-issued ID documents, live selfie captures, and facial biometric vectors. This sensitive data is processed exclusively for identity verification and fraud prevention via our partner, Stripe Identity.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Geolocation Data</h3>
                <p className="text-xs leading-relaxed">Precise GPS data from your mobile device to facilitate parking spot location, navigation, and geofenced access control.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Financial & Transactional Data</h3>
                <p className="text-xs leading-relaxed">Payment card details (tokenized), transaction history, billing addresses, and payout bank account information.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Technical & Usage Data</h3>
                <p className="text-xs leading-relaxed">IP addresses, device identifiers, browser type, operating system, and interaction logs with our Service.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. Legal Basis for Processing</h2>
            <p className="mb-4">We process your personal data under the following legal bases:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Contractual Necessity:</strong> To provide the Service, process bookings, and facilitate payments.</li>
              <li><strong>Legal Obligation:</strong> To comply with anti-money laundering (AML), Know Your Customer (KYC), and tax regulations.</li>
              <li><strong>Legitimate Interests:</strong> To improve our platform, ensure security, and prevent fraud.</li>
              <li><strong>Consent:</strong> Explicit consent is obtained for the processing of biometric data and optional marketing communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Data Sharing & International Transfers</h2>
            <p className="mb-4">
              We may share your data with trusted third parties, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm mb-4">
              <li><strong>Payment Processors:</strong> Stripe, Inc.</li>
              <li><strong>Cloud Infrastructure:</strong> Google Cloud Platform.</li>
              <li><strong>Identity Verification Providers:</strong> Stripe Identity.</li>
              <li><strong>Law Enforcement:</strong> When required by a valid subpoena, court order, or search warrant.</li>
            </ul>
            <p className="text-sm">
              Your data may be transferred to, and stored at, a destination outside the European Economic Area (EEA) or the UK. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs), to protect your data during such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Your Rights (GDPR & CCPA)</h2>
            <p className="mb-4">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Correction of inaccurate or incomplete data.</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your data, subject to legal retention obligations.</li>
              <li><strong>Right to Restrict Processing:</strong> Request that we limit the processing of your data.</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, commonly used machine-readable format.</li>
              <li><strong>Right to Non-Discrimination (CCPA):</strong> We will not discriminate against you for exercising your privacy rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">6. Data Retention</h2>
            <p className="mb-4">
              We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements. Typically, financial records are retained for 7 years, while identity verification data is retained for the duration of the account plus a safety period to prevent ban evasion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact our Data Protection Officer at:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 inline-block">
              <p className="font-bold text-slate-900">XPND Technologies Inc.</p>
              <p className="text-sm">Attn: Data Protection Officer</p>
              <p className="text-sm">Email: privacy@parkr.xpnd.tech</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;