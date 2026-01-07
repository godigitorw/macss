'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';

interface Property {
  id: string;
  title: string;
  price: number;
  district: string;
  sector: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  type: string;
  status: 'FOR_SALE' | 'FOR_RENT' | 'SOLD' | 'RENTED';
  images: string[];
  featured?: boolean;
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  // Get filter values from URL params
  const statusParam = searchParams.get('status');
  const typeParam = searchParams.get('type');
  const districtParam = searchParams.get('district');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sortParam = searchParams.get('sort');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Build query string
        const params = new URLSearchParams();
        if (statusParam) params.append('status', statusParam);
        if (typeParam) params.append('type', typeParam);
        if (districtParam) params.append('district', districtParam);
        if (minPriceParam) params.append('minPrice', minPriceParam);
        if (maxPriceParam) params.append('maxPrice', maxPriceParam);

        const response = await fetch(`/api/properties?${params.toString()}`);
        if (response.ok) {
          let data = await response.json();
          
          // Apply sorting
          if (sortParam === 'price-low') {
            data.sort((a: Property, b: Property) => a.price - b.price);
          } else if (sortParam === 'price-high') {
            data.sort((a: Property, b: Property) => b.price - a.price);
          } else if (sortParam === 'newest') {
            // Already sorted by createdAt desc from API
          } else {
            // Default: featured first
            data.sort((a: Property, b: Property) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return 0;
            });
          }

          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusParam, typeParam, districtParam, minPriceParam, maxPriceParam, sortParam]);

  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    if (e.target.value) {
      url.searchParams.set('sort', e.target.value);
    } else {
      url.searchParams.delete('sort');
    }
    window.history.pushState({}, '', url.toString());
    window.location.reload();
  };

  // Format property for PropertyCard component
  const formatPropertyForCard = (property: Property) => ({
    id: property.id,
    title: property.title,
    price: formatPrice(property.price, property.status),
    location: `${property.sector}, ${property.district}`,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area ? `${property.area} m²` : 'N/A',
    type: property.type.toLowerCase(),
    status: property.status,
    image: property.images[0] || 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    featured: property.featured,
  });

  const formatPrice = (price: number, status: string) => {
    const formattedPrice = new Intl.NumberFormat('en-RW', {
      minimumFractionDigits: 0,
    }).format(price);

    if (status === 'FOR_RENT' || status === 'RENTED') {
      return `${formattedPrice} RWF/month`;
    }
    return `${formattedPrice} RWF`;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Discover Your Perfect Property
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Browse through our extensive collection of properties across Rwanda
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Properties Grid */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[280px,1fr] gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:sticky lg:top-24 h-fit">
                <PropertyFilters />
              </aside>

              {/* Properties Grid */}
              <div>
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                    {loading ? 'Loading...' : `${properties.length} ${properties.length === 1 ? 'Property' : 'Properties'} Found`}
                  </h2>
                  <select 
                    onChange={handleSortChange}
                    defaultValue={sortParam || ''}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
                  >
                    <option value="">Sort by: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Loading State */}
                {loading ? (
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
                ) : currentProperties.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {currentProperties.map((property) => (
                        <PropertyCard key={property.id} property={formatPropertyForCard(property)} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              currentPage === pageNumber
                                ? 'bg-primary-500 text-white'
                                : 'border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                    <button
                      onClick={() => window.location.href = '/properties'}
                      className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
