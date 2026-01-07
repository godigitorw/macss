'use client';

import Link from 'next/link';
import { FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';

export default function CTASection() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            Whether you're buying, selling, or renting, our expert team is here to help you every step of the way
          </p>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Call Us Card */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <FiPhone className="w-7 h-7 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                <a
                  href={`tel:+${process.env.NEXT_PUBLIC_PHONE}`}
                  className="block text-white text-base font-semibold hover:text-white/80 transition-colors"
                >
                  +{process.env.NEXT_PUBLIC_PHONE || '250788308043'}
                </a>
              </div>
            </div>
          </div>

          {/* Email Us Card */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMail className="w-7 h-7 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                  className="block text-white text-sm font-semibold hover:text-white/80 transition-colors break-all"
                >
                  {process.env.NEXT_PUBLIC_EMAIL || 'info@macssrealestaterw.com'}
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1">WhatsApp</h3>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white text-base font-semibold hover:text-white/80 transition-colors"
                >
                  Start Chat
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/properties"
            className="w-full sm:w-auto px-6 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-sm"
          >
            Browse Properties
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm"
          >
            Contact Us
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-white/80 text-xs">Properties Sold</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">1000+</div>
            <div className="text-white/80 text-xs">Happy Clients</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">10+</div>
            <div className="text-white/80 text-xs">Years Experience</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">98%</div>
            <div className="text-white/80 text-xs">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
