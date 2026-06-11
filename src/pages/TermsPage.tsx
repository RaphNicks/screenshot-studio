import { Link } from 'react-router-dom'
import { Camera, ArrowLeft } from 'lucide-react'

const LAST_UPDATED = 'June 9, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display font-bold text-xl text-text-primary mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-void relative">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-25 -z-10" />

      {/* Header */}
      <div className="border-b border-border bg-panel/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-all">
              <Camera size={16} className="text-accent-light" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              Screenshot<span className="text-accent">Studio</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl text-text-primary mb-3">
            Terms and Conditions
          </h1>
          <p className="text-text-dim text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using Screenshot Studio ("the Service"), you agree to be bound
            by these Terms and Conditions. If you do not agree to these terms, please do
            not use the Service.
          </p>
          <p>
            These terms apply to all visitors, users, and others who access or use the Service,
            including free and paid users.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            Screenshot Studio is a browser-based tool that allows users to enhance and
            export screenshots with custom backgrounds, padding, shadows, and framing.
          </p>
          <p>
            The Service is provided by Razid Technologies and is available at
            screenshot-studio-fmfp.vercel.app and any associated domains.
          </p>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service at any
            time without prior notice.
          </p>
        </Section>

        <Section title="3. User Accounts">
          <p>
            You may use certain features of the Service without creating an account.
            However, to save exports and access Pro features, you must register for an account.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account
            credentials and for all activity that occurs under your account.
          </p>
          <p>
            You must provide accurate and complete information when creating your account.
            You may not use another person's account without their permission.
          </p>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms,
            engage in fraudulent activity, or remain inactive for extended periods.
          </p>
        </Section>

        <Section title="4. Free and Pro Plans">
          <p>
            The Service offers a Free plan with limited features and a Pro plan with
            expanded features available via paid subscription.
          </p>
          <p>
            Free plan users are limited to 5 exports per day at 1x resolution. Pro plan
            users receive unlimited exports, higher resolutions, and additional features
            as described on the pricing page.
          </p>
          <p>
            We reserve the right to change the features included in each plan at any time.
            Material changes will be communicated to existing subscribers via email.
          </p>
        </Section>

        <Section title="5. Payments and Billing">
          <p>
            Pro plan subscriptions are processed through Lemon Squeezy, our third-party
            payment provider. By subscribing, you agree to Lemon Squeezy's terms of service
            and privacy policy in addition to ours.
          </p>
          <p>
            Subscription fees are billed on a recurring basis (monthly or annually depending
            on your selected plan) until cancelled.
          </p>
          <p>
            You may cancel your subscription at any time. Upon cancellation, you will retain
            Pro access until the end of your current billing period. No refunds are issued
            for partial billing periods unless required by applicable law.
          </p>
          <p>
            All prices are listed in USD. We reserve the right to change pricing with
            30 days notice to existing subscribers.
          </p>
        </Section>

        <Section title="6. Privacy and Data">
          <p>
            All image processing in Screenshot Studio happens entirely within your browser.
            Your screenshots and images are never uploaded to or stored on our servers
            unless you explicitly choose to save an export to your account.
          </p>
          <p>
            When you save exports to your account, files are stored securely and
            automatically deleted after 30 days.
          </p>
          <p>
            We collect account information (name, email) and usage data (export counts,
            plan status) necessary to operate the Service. We do not sell your personal
            data to third parties.
          </p>
          <p>
            For full details on how we handle your data, please refer to our Privacy Policy.
          </p>
        </Section>

        <Section title="7. Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>Upload or process content that is illegal, harmful, or infringes on the rights of others</li>
            <li>Attempt to reverse engineer, hack, or disrupt the Service</li>
            <li>Create multiple accounts to circumvent free plan limits</li>
            <li>Use automated tools to access the Service without our written permission</li>
            <li>Resell or redistribute the Service without authorization</li>
            <li>Upload malicious files or content designed to harm other users</li>
          </ul>
          <p>
            Violation of these rules may result in immediate account termination without refund.
          </p>
        </Section>

        <Section title="8. Intellectual Property">
          <p>
            The Service, including its design, code, branding, and content, is owned by
            Razid Technologies and protected by applicable intellectual property laws.
          </p>
          <p>
            You retain full ownership of any screenshots and images you upload or create
            using the Service. By using the Service, you grant us no rights to your content
            beyond what is necessary to provide the Service.
          </p>
          <p>
            You may not copy, reproduce, or distribute any part of the Service without
            our prior written consent.
          </p>
        </Section>

        <Section title="9. Disclaimers and Limitation of Liability">
          <p>
            The Service is provided as-is without warranties of any kind, either express
            or implied. We do not guarantee that the Service will be uninterrupted,
            error-free, or completely secure.
          </p>
          <p>
            To the maximum extent permitted by law, Razid Technologies shall not be liable
            for any indirect, incidental, special, or consequential damages arising from
            your use of or inability to use the Service.
          </p>
          <p>
            Our total liability to you for any claims arising from these terms or the
            Service shall not exceed the amount you paid us in the 12 months prior to
            the claim.
          </p>
        </Section>

        <Section title="10. Changes to Terms">
          <p>
            We reserve the right to update these Terms and Conditions at any time.
            When we make changes, we will update the last updated date at the top
            of this page.
          </p>
          <p>
            Continued use of the Service after changes are posted constitutes your
            acceptance of the updated terms. If you do not agree to the updated terms,
            you must stop using the Service.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms and Conditions are governed by and construed in accordance with
            the laws of the Federal Republic of Nigeria. Any disputes arising from these
            terms shall be subject to the exclusive jurisdiction of the courts of Nigeria.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="mt-3 p-4 rounded-xl bg-panel border border-border space-y-1">
            <p className="text-text-primary font-medium">Razid Technologies</p>
            <p>Port Harcourt, Rivers State, Nigeria</p>
            <p>
              Email:{' '}
              <a
                href="mailto:razidtechnologies@gmail.com"
                className="text-accent hover:underline"
              >
                razidtechnologies@gmail.com
              </a>
            </p>
          </div>
        </Section>

        {/* Footer */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-dim text-xs">
            2026 Razid Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-text-dim hover:text-text-secondary text-xs transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-text-dim hover:text-text-secondary text-xs transition-colors">
              Pricing
            </Link>
            <Link to="/signup" className="text-text-dim hover:text-text-secondary text-xs transition-colors">
              Sign Up
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}