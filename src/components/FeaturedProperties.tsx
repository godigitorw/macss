'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiHeart } from 'react-icons/fi';

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
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch('/api/properties?featured=true');
        if (response.ok) {
          const data = await response.json();
          // Limit to 8 properties for the grid
          setProperties(data.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

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

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties across Rwanda
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-200" />
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
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No featured properties available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium properties across Rwanda
          </p>
        </div>

        {/* Properties Grid - 4 columns on desktop, 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-64 md:h-56 overflow-hidden">
                <Image
                  src={property.images[0] || 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp'}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    property.status === 'FOR_SALE'
                      ? 'bg-primary-500 text-white'
                      : property.status === 'FOR_RENT'
                      ? 'bg-accent-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
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
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <FiHeart className="w-4 h-4 text-gray-700" />
                </button>
                {/* Property Type */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    {formatPropertyType(property.type)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Price */}
                <div className="mb-2">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(property.price, property.status)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FiMapPin className="w-4 h-4 mr-1" />
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
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-primary-500/30"
          >
            View All Properties
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
