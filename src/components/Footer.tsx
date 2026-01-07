'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Properties', href: '/properties' },
    { name: 'Buy', href: '/properties?status=FOR_SALE' },
    { name: 'Rent', href: '/properties?status=FOR_RENT' },
    { name: 'Contact', href: '/contact' },
  ];

  const propertyTypes = [
    { name: 'Houses', href: '/properties?type=house' },
    { name: 'Apartments', href: '/properties?type=apartment' },
    { name: 'Land', href: '/properties?type=land' },
    { name: 'Commercial', href: '/properties?type=commercial' },
    { name: 'Offices', href: '/properties?type=office' },
    { name: 'Warehouses', href: '/properties?type=warehouse' },
  ];

  const locations = [
    { name: 'Gasabo', href: '/properties?location=Gasabo' },
    { name: 'Kicukiro', href: '/properties?location=Kicukiro' },
    { name: 'Nyarugenge', href: '/properties?location=Nyarugenge' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="mb-4">
              <Image
                src={process.env.NEXT_PUBLIC_LOGO_URL || '/logo.png'}
                alt="MAC SS Real Estate Rwanda"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Rwanda's trusted real estate partner. We help you find your dream property across Kigali and beyond.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Property Types</h3>
            <ul className="space-y-2">
              {propertyTypes.map((type) => (
                <li key={type.name}>
                  <Link
                    href={type.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  {process.env.NEXT_PUBLIC_ADDRESS || 'KG 11 IKAZE HOUSE 3RD FLOOR No 2'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href={`tel:+${process.env.NEXT_PUBLIC_PHONE}`}
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  +{process.env.NEXT_PUBLIC_PHONE || '250788308043'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  {process.env.NEXT_PUBLIC_EMAIL || 'info@macssrealestaterw.com'}
                </a>
              </li>
            </ul>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} MAC SS Real Estate Rwanda. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
