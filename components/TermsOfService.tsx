import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-12 border-b border-slate-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Global Terms of Service</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Last Updated: January 1, 2025</p>
        </div>

        <div className="space-y-12 text-slate-600 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Agreement to Terms</h2>
            <p className="mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and XPND Technologies Inc. ("Parkr", "we", "us"). By accessing or using the Parkr website, mobile application, and related services (collectively, the "Service"), you agree to comply with and be bound by these Terms.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-amber-500">
              <p className="text-xs font-bold text-amber-700">
                NOTICE REGARDING DISPUTE RESOLUTION: THESE TERMS CONTAIN A BINDING ARBITRATION PROVISION AND CLASS ACTION WAIVER THAT AFFECT YOUR RIGHTS. PLEASE READ SECTION 8 CAREFULLY.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">2. The Service (Peer-to-Peer Marketplace)</h2>
            <p className="mb-4">
              Parkr is a technology platform that enables users to list, discover, book, and pay for parking spaces.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Parkees (Hosts):</strong> Users who publish parking spaces for rent.</li>
              <li><strong>Parkers (Drivers):</strong> Users who search for and book parking spaces.</li>
            </ul>
            <p className="mt-4">
              <strong>Disclaimer:</strong> Parkr does not own, lease, or manage any parking spaces. We are not a real estate broker, rental agent, or insurer. We act exclusively as a facilitator of the transaction between Parkees and Parkers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. User Obligations & Conduct</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Provide accurate, current, and complete identity information during verification.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Comply with all applicable local laws, regulations, and zoning ordinances regarding parking and property rental.</li>
              <li>Treat other users and their property with respect.</li>
            </ul>
            <p className="mt-4">
              <strong>Prohibited Conduct:</strong> You may not use the Service to facilitate illegal activities, circumvent fees (off-platform transactions), or harass other users. Violation of these rules may result in immediate suspension or termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Fees, Payments & Cancellations</h2>
            <p className="mb-4">
              <strong>Fees:</strong> Parkr charges a service fee (commission) on transactions, which is clearly disclosed prior to booking. We reserve the right to change our fee structure at any time.
            </p>
            <p className="mb-4">
              <strong>Cancellations:</strong> Cancellation policies are set by the Parkee or by Parkr's default policy. Refunds are processed in accordance with the applicable cancellation policy at the time of booking.
            </p>
            <p className="mb-4">
              <strong>Taxes:</strong> You are solely responsible for determining your applicable tax obligations and reporting/remitting taxes to the appropriate authorities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Liability Release & Indemnification</h2>
            <p className="mb-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW, XPND TECHNOLOGIES INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
            </p>
            <p className="mb-4">
              You agree to release, defend, indemnify, and hold Parkr harmless from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your access to or use of the Service, or your violation of these Terms.
            </p>
            <p className="text-sm font-bold text-slate-900">
              SPECIFICALLY: We are not responsible for damage to vehicles, theft of contents, personal injury, or property damage occurring at a listed parking space.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">6. Identity Verification</h2>
            <p className="mb-4">
              We use third-party services (e.g., Stripe Identity) to verify user identities. We do not warranty the accuracy of these checks. A "Verified" badge indicates that a user has completed a verification process, but it is not an endorsement or guarantee of their identity or trustworthiness.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">7. Intellectual Property</h2>
            <p className="mb-4">
              The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of XPND Technologies Inc. and its licensors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">8. Governing Law & Dispute Resolution</h2>
            <p className="mb-4">
              <strong>Governing Law:</strong> These Terms shall be governed by the laws of England and Wales, without regard to conflict of law principles.
            </p>
            <p className="mb-4">
              <strong>Arbitration:</strong> Any dispute arising from or relating to the subject matter of these Terms shall be finally settled by arbitration in London, United Kingdom, using the English language.
            </p>
            <p className="mb-4">
              <strong>Class Action Waiver:</strong> You and Parkr agree that each may bring claims against the other only in your or its individual capacity and not as a plaintiff or class member in any purported class or representative proceeding.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;