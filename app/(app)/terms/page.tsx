import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Dotheon platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen text-justify">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: 30th April 2025</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-600 mb-6">
            Welcome to Dotheon. By accessing or using our platform, you agree to
            be bound by these Terms of Service. Please read them carefully
            before using our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            2. Definitions
          </h2>
          <p className="text-gray-600 mb-6">
            "Platform" refers to the Dotheon website and all associated
            services. "User" refers to any individual or entity that accesses or
            uses the Platform. "Services" refers to all features, functionality,
            and content provided through the Platform.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            3. Eligibility
          </h2>
          <p className="text-gray-600 mb-6">
            To use our Services, you must be at least 18 years old and have the
            legal capacity to enter into binding contracts. By using our
            Services, you represent and warrant that you meet these
            requirements.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            4. User Responsibilities
          </h2>
          <p className="text-gray-600 mb-6">
            Users are responsible for maintaining the confidentiality of their
            account information and for all activities that occur under their
            account. Users must comply with all applicable laws and regulations
            while using the Platform.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            5. Risk Disclosure
          </h2>
          <p className="text-gray-600 mb-6">
            Cryptocurrency and DeFi investments involve significant risks. Users
            acknowledge that they understand these risks and that Dotheon is not
            responsible for any financial losses incurred through the use of our
            Services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            6. Intellectual Property
          </h2>
          <p className="text-gray-600 mb-6">
            All content, features, and functionality on the Platform are owned
            by Dotheon and are protected by international copyright, trademark,
            and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            7. Limitation of Liability
          </h2>
          <p className="text-gray-600 mb-6">
            Dotheon shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of or
            inability to use the Platform.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            8. Changes to Terms
          </h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify these Terms at any time. We will
            notify users of any material changes through the Platform or via
            email. Continued use of the Platform after such changes constitutes
            acceptance of the new Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            9. Contact Information
          </h2>
          <p className="text-gray-600">
            For any questions about these Terms, please contact us at
            support@Dotheon.com
          </p>
        </div>
      </div>
    </div>
  );
}
