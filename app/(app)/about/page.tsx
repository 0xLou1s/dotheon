import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about YieldCraft and our mission to revolutionize yield farming.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen text-justify">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          About YieldCraft
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            YieldCraft is at the forefront of decentralized finance, dedicated
            to making yield farming accessible and efficient for everyone. Our
            platform bridges the gap between complex DeFi strategies and
            everyday users, ensuring that both beginners and experienced
            investors can participate in the growing DeFi ecosystem.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 mb-6">
            We believe that DeFi should be accessible to everyone. Our mission
            is to simplify complex yield farming strategies while maintaining
            the highest standards of security and innovation. By developing
            intuitive tools and automated strategies, we're making it easier for
            users to maximize their returns in the DeFi space.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            What We Offer
          </h2>
          <p className="text-gray-600 mb-6">
            At YieldCraft, we provide automated yield farming strategies that
            adapt to market conditions, ensuring optimal returns for our users.
            Our platform combines cutting-edge technology with rigorous security
            measures to protect your assets and investments. Whether you're new
            to DeFi or an experienced investor, our user-friendly interface
            makes it easy to navigate the complex world of yield farming.
          </p>

          <p className="text-gray-600">
            Join us in shaping the future of decentralized finance. Together, we
            can make yield farming more accessible, secure, and profitable for
            everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
