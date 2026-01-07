import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiAward, FiUsers, FiTrendingUp, FiShield } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                About MAC SS Real Estate
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Your trusted partner in finding the perfect property across Rwanda. Building dreams, one property at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    MAC SS Real Estate was founded with a simple mission: to make property transactions in Rwanda transparent, efficient, and accessible to everyone. What started as a small team of passionate real estate professionals has grown into one of the most trusted names in the industry.
                  </p>
                  <p>
                    With over a decade of experience in the Rwandan real estate market, we have helped thousands of clients find their dream properties, whether it's a cozy apartment in Kigali, a commercial space for their business, or land for investment.
                  </p>
                  <p>
                    Our deep understanding of the local market, combined with our commitment to excellence and customer satisfaction, has made us the go-to choice for property seekers and investors across Rwanda.
                  </p>
                </div>
              </div>

              <div className="relative h-96 lg:h-full min-h-[400px] rounded-xl overflow-hidden border-2 border-gray-200">
                <Image
                  src="https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp"
                  alt="MAC SS Real Estate Office"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <FiShield className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We operate with honesty and transparency in every transaction, building trust with our clients.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <FiAward className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our service, exceeding expectations at every turn.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <FiUsers className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Client-Focused</h3>
                <p className="text-gray-600">
                  Your needs are our priority. We listen, understand, and deliver solutions tailored to you.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <FiTrendingUp className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We embrace technology and innovation to provide the best real estate experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Track Record
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Numbers that speak for themselves
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-gray-600">Properties Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">1000+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">10+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">98%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose MAC SS Real Estate?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                What sets us apart from the rest
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Team</h3>
                <p className="text-gray-600">
                  Our team of experienced professionals brings years of local market knowledge and expertise to help you make informed decisions.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Services</h3>
                <p className="text-gray-600">
                  From property search to closing, we handle every aspect of the transaction, making the process smooth and stress-free.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Compliance</h3>
                <p className="text-gray-600">
                  All our properties are verified and legally compliant, ensuring your investment is secure and protected.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Prime Locations</h3>
                <p className="text-gray-600">
                  Access to the best properties in prime locations across Kigali and other major cities in Rwanda.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Competitive Pricing</h3>
                <p className="text-gray-600">
                  Fair and transparent pricing with no hidden costs, ensuring you get the best value for your investment.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-400 transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">After-Sales Support</h3>
                <p className="text-gray-600">
                  Our relationship doesn't end at closing. We provide ongoing support for all your property needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200 p-8">
                <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                  To revolutionize the real estate experience in Rwanda by providing transparent, efficient, and customer-centric services that help individuals and businesses find their perfect properties while contributing to the growth of Rwanda's real estate sector.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-8">
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed">
                  To be the leading real estate company in Rwanda, recognized for our integrity, innovation, and commitment to excellence. We envision a future where every Rwandan has access to quality housing and investment opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Let's help you find the perfect property or answer any questions you may have
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/properties"
                className="px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
