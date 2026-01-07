'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getIconComponent } from '@/lib/iconMap';

interface PropertyType {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  icon: string | null;
  order: number;
}

interface PropertyCount {
  type: string;
  count: number;
}

export default function PropertyCategories() {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [propertyCounts, setPropertyCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property types
        const typesResponse = await fetch('/api/property-types?active=true');
        if (typesResponse.ok) {
          const types = await typesResponse.json();
          setPropertyTypes(types);

          // Fetch all properties to count by type
          const propertiesResponse = await fetch('/api/properties');
          if (propertiesResponse.ok) {
            const properties = await propertiesResponse.json();
            
            // Count properties by type
            const counts: { [key: string]: number } = {};
            properties.forEach((property: any) => {
              counts[property.type] = (counts[property.type] || 0) + 1;
            });
            setPropertyCounts(counts);
          }
        }
      } catch (error) {
        console.error('Error fetching property categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Property Type
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect property that matches your needs from our diverse portfolio
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border-2 border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (propertyTypes.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Property Type
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect property that matches your needs from our diverse portfolio
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertyTypes.map((type) => {
            const count = propertyCounts[type.name] || 0;
            
            return (
              <Link
                key={type.id}
                href={`/properties?type=${type.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-primary-400 transition-all duration-300 bg-white"
              >
                {/* Background Image */}
                <div className="relative h-64 md:h-48 overflow-hidden">
                  <Image
                    src="https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp"
                    alt={type.displayName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg text-primary-600">
                      {(() => {
                        const IconComponent = getIconComponent(type.icon);
                        return <IconComponent className="w-7 h-7" />;
                      })()}
                    </div>
                  </div>

                  {/* Property Count Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 bg-primary-500 text-white rounded-full text-sm font-semibold shadow-lg">
                      {count}+ {count === 1 ? 'Property' : 'Properties'}
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">
                      {type.displayName}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {type.description || `Browse ${type.displayName.toLowerCase()} properties`}
                    </p>
                  </div>
                </div>

                {/* Hover Arrow Indicator */}
                <div className="absolute bottom-5 right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
                  <svg
                    className="w-5 h-5 text-primary-600"
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
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
