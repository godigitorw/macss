'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Property {
  id: string;
  title: string;
  price: number;
  district: string;
  sector: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  images: string[];
  type: string;
  status: 'FOR_SALE' | 'FOR_RENT' | 'SOLD' | 'RENTED';
  createdAt: string;
}

export default function NewListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Fetch new listings
  useEffect(() => {
    const fetchNewListings = async () => {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          // Get the 6 most recent properties
          setProperties(data.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching new listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewListings();
  }, []);

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, properties.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (properties.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [maxIndex, properties.length]);

  const formatPrice = (price: number, status: string) => {
    const formattedPrice = new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);

    if (status === 'FOR_RENT' || status === 'RENTED') {
      return `${formattedPrice}/mo`;
    }
    return formattedPrice;
  };

  const formatPropertyType = (type: string) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  // Check if property is new (created within last 7 days)
  const isNewProperty = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                New Listings
              </h2>
              <p className="text-lg text-gray-600">
                Fresh properties just added to our portfolio
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                New Listings
              </h2>
              <p className="text-lg text-gray-600">
                No new properties available at the moment.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              New Listings
            </h2>
            <p className="text-lg text-gray-600">
              Fresh properties just added to our portfolio
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-primary-500 disabled:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-primary-500 disabled:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <Link
                  href={`/properties/${property.id}`}
                  className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-all duration-300 block"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={property.images[0] || 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp'}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* New Badge */}
                    {isNewProperty(property.createdAt) && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                          NEW
                        </span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.status === 'FOR_SALE'
                            ? 'bg-primary-500 text-white'
                            : property.status === 'FOR_RENT'
                            ? 'bg-accent-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {property.status === 'FOR_SALE' ? 'For Sale' : 
                         property.status === 'FOR_RENT' ? 'For Rent' :
                         property.status === 'SOLD' ? 'Sold' : 'Rented'}
                      </span>
                    </div>
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to favorites logic here
                      }}
                      className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <FiHeart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Type */}
                    <div className="mb-2">
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {formatPropertyType(property.type)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {property.title}
                    </h3>

                    {/* Price */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(property.price, property.status)}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{property.sector}, {property.district}</span>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-3 text-sm text-gray-600 pt-3 border-t border-gray-100">
                      {property.bedrooms && property.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{property.bedrooms}</span>
                          <span>Beds</span>
                        </div>
                      )}
                      {property.bathrooms && property.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{property.bathrooms}</span>
                          <span>Baths</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{property.area} m²</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index
                  ? 'bg-primary-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/properties?sort=newest"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-primary-500/30"
          >
            View All New Listings
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
