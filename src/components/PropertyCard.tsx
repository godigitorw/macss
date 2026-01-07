'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiHeart } from 'react-icons/fi';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  status: 'FOR_SALE' | 'FOR_RENT' | 'SOLD' | 'RENTED';
  image: string;
  featured?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const getStatusBadge = () => {
    switch (property.status) {
      case 'FOR_SALE':
        return { color: 'bg-green-500 text-white', label: 'For Sale' };
      case 'FOR_RENT':
        return { color: 'bg-blue-500 text-white', label: 'For Rent' };
      case 'SOLD':
        return { color: 'bg-gray-500 text-white', label: 'Sold' };
      case 'RENTED':
        return { color: 'bg-gray-500 text-white', label: 'Rented' };
      default:
        return { color: 'bg-gray-500 text-white', label: property.status };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-primary-500 text-white rounded-full text-xs font-semibold">
              Featured
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            // Add favorite logic here
          }}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <FiHeart className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="text-2xl font-bold text-primary-600 mb-2">
          {property.price}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FiMapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-sm text-gray-600 pt-3 border-t border-gray-100">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{property.bedrooms}</span>
              <span>Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{property.bathrooms}</span>
              <span>Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="font-medium">{property.area}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
