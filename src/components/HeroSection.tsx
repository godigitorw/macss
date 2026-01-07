'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiHome, FiDollarSign } from 'react-icons/fi';

const stats = [
  { value: '500+', label: 'Properties' },
  { value: '1000+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
];

const propertyTypes = ['House', 'Apartment', 'Land', 'Commercial', 'Warehouse', 'Office'];

const locations = [
  'All Districts',
  'Gasabo',
  'Kicukiro',
  'Nyarugenge',
  'Rwamagana',
  'Kayonza',
  'Musanze',
];

export default function HeroSection() {
  const [searchType, setSearchType] = useState<'buy' | 'rent'>('buy');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to properties page with filters
    const params = new URLSearchParams({
      status: searchType === 'buy' ? 'FOR_SALE' : 'FOR_RENT',
      ...(propertyType && { type: propertyType.toLowerCase() }),
      ...(location && location !== 'All Districts' && { location }),
    });
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <section className="relative min-h-[550px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://macssproperties.b-cdn.net/vc2%20(1).png"
          alt="MAC SS Real Estate Rwanda"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full relative z-10">
        <div className="space-y-6">
          {/* Header Section - Badge, Title, and Stats in one row on desktop */}
          <div className="grid lg:grid-cols-[1fr,auto] gap-6 lg:gap-12 items-start animate-in fade-in slide-in-from-left duration-700">
            {/* Left: Badge and Title */}
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
                Rwanda's Trusted Real Estate Partner
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                  Find <span className="text-primary-400 relative">
                    Houses for Sale
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 200 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 10C60 2 140 2 198 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    </svg>
                  </span>{' '}
                  <span className="whitespace-nowrap">in Rwanda & Kigali</span>
                </h1>
                <p className="text-base md:text-lg text-gray-100 max-w-xl drop-shadow mt-3">
                  Discover premium houses, apartments, land, and commercial properties across Kigali and beyond.
                </p>
              </div>
            </div>

            {/* Right: Stats - Horizontal on mobile, vertical on desktop */}
            <div className="flex lg:flex-col gap-6 lg:gap-4 justify-center lg:justify-start">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-right">
                  <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Form - Compact Horizontal Layout */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 lg:p-5 animate-in fade-in slide-in-from-bottom duration-700">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Buy/Rent Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg lg:w-48">
                  <button
                    type="button"
                    onClick={() => setSearchType('buy')}
                    className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-all text-sm ${
                      searchType === 'buy'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('rent')}
                    className={`flex-1 py-2.5 px-3 rounded-lg font-medium transition-all text-sm ${
                      searchType === 'rent'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Rent
                  </button>
                </div>

                {/* Property Type */}
                <div className="relative flex-1">
                  <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-gray-700 text-sm"
                  >
                    <option value="">All Property Types</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="relative flex-1">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-gray-700 text-sm"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="lg:w-48 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-primary-500/30"
                >
                  <FiSearch className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                  <span className="sm:hidden">Search Properties</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
