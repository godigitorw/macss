'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="https://macss.b-cdn.net/mac%20ss%20real%20estate%20solution.png"
              alt="MAC SS Real Estate Rwanda"
              width={180}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-500 font-medium transition-colors text-lg"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Right */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/list-property"
              className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/30"
            >
              List Your Property
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-700 hover:text-primary-500 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile CTA */}
              <Link
                href="/list-property"
                className="mt-4 mx-4 px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                List Your Property
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
