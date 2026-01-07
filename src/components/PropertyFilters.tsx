'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiHome, FiMapPin, FiSliders } from 'react-icons/fi';

interface PropertyType {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
}

interface Property {
  price: number;
  district: string;
}

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch property types and properties to determine available filters
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch property types
        const typesResponse = await fetch('/api/property-types?active=true');
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          setPropertyTypes(typesData);
        }

        // Fetch all properties to determine price range and districts
        const propertiesResponse = await fetch('/api/properties');
        if (propertiesResponse.ok) {
          const properties: Property[] = await propertiesResponse.json();
          
          if (properties.length > 0) {
            // Get unique districts
            const districts = Array.from(new Set(properties.map(p => p.district))).sort();
            setAvailableDistricts(districts);

            // Calculate price range
            const prices = properties.map(p => p.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            
            // Round to nearest 10M for cleaner ranges
            const roundedMin = Math.floor(min / 10000000) * 10000000;
            const roundedMax = Math.ceil(max / 10000000) * 10000000;
            
            setMinPrice(roundedMin);
            setMaxPrice(roundedMax);
            
            // Set initial price range from URL params or use full range
            const urlMinPrice = searchParams.get('minPrice');
            const urlMaxPrice = searchParams.get('maxPrice');
            
            setPriceRange([
              urlMinPrice ? parseInt(urlMinPrice) : roundedMin,
              urlMaxPrice ? parseInt(urlMaxPrice) : roundedMax
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  // Handle price range change with debouncing
  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    
    // Clear existing timeout
    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }

    // Set new timeout to apply filter after user stops dragging
    priceTimeoutRef.current = setTimeout(() => {
      applyPriceFilter(newRange);
    }, 800); // Wait 800ms after user stops dragging
  };

  const applyPriceFilter = (range: [number, number]) => {
    const params = new URLSearchParams(window.location.search);

    if (range[0] > minPrice) {
      params.set('minPrice', range[0].toString());
    } else {
      params.delete('minPrice');
    }

    if (range[1] < maxPrice) {
      params.set('maxPrice', range[1].toString());
    } else {
      params.delete('maxPrice');
    }

    const queryString = params.toString();
    const newUrl = `/properties${queryString ? '?' + queryString : ''}`;
    
    if (window.location.pathname + window.location.search !== newUrl) {
      window.location.href = newUrl;
    }
  };

  // Auto-apply non-price filters when they change
  useEffect(() => {
    // Skip if still loading initial data or dragging price slider
    if (loading || isDragging) return;

    const params = new URLSearchParams(window.location.search);

    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }

    if (district) {
      params.set('district', district);
    } else {
      params.delete('district');
    }

    const queryString = params.toString();
    const newUrl = `/properties${queryString ? '?' + queryString : ''}`;
    
    // Only update if URL actually changed
    if (window.location.pathname + window.location.search !== newUrl) {
      window.location.href = newUrl;
    }
  }, [status, type, district, loading, isDragging]);

  const clearFilters = () => {
    setStatus('');
    setType('');
    setDistrict('');
    setPriceRange([minPrice, maxPrice]);
    window.location.href = '/properties';
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FiSliders className="w-5 h-5" />
          Filters
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Property Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value=""
                checked={status === ''}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">All</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value="FOR_SALE"
                checked={status === 'FOR_SALE'}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">For Sale</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value="FOR_RENT"
                checked={status === 'FOR_RENT'}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">For Rent</span>
            </label>
          </div>
        </div>

        {/* Property Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiHome className="w-4 h-4" />
            Property Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
          >
            <option value="">All Types</option>
            {loading ? (
              <option disabled>Loading...</option>
            ) : (
              propertyTypes.map((propertyType) => (
                <option key={propertyType.id} value={propertyType.name}>
                  {propertyType.displayName}
                </option>
              ))
            )}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiMapPin className="w-4 h-4" />
            District
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
          >
            <option value="">All Districts</option>
            {loading ? (
              <option disabled>Loading...</option>
            ) : availableDistricts.length > 0 ? (
              availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))
            ) : (
              <option disabled>No districts available</option>
            )}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Price Range (RWF)
          </label>
          <div className="space-y-4">
            {/* Price Display */}
            <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
              <span className="font-medium">{formatPrice(priceRange[0])}</span>
              <span className="text-gray-400">-</span>
              <span className="font-medium">{formatPrice(priceRange[1])}</span>
            </div>

            {/* Dual Range Slider */}
            <div className="relative pt-2 pb-4">
              {/* Track */}
              <div className="absolute top-2 left-0 right-0 h-2 bg-gray-200 rounded-lg"></div>

              {/* Active Range */}
              <div
                className="absolute top-2 h-2 bg-primary-500 rounded-lg"
                style={{
                  left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                }}
              ></div>

              {/* Min Range Input */}
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={Math.max(10000000, Math.floor((maxPrice - minPrice) / 100))}
                value={priceRange[0]}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onChange={(e) => {
                  const newMin = Math.min(Number(e.target.value), priceRange[1] - 10000000);
                  handlePriceChange([newMin, priceRange[1]]);
                }}
                className="absolute w-full h-2 top-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
              />

              {/* Max Range Input */}
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                step={Math.max(10000000, Math.floor((maxPrice - minPrice) / 100))}
                value={priceRange[1]}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onChange={(e) => {
                  const newMax = Math.max(Number(e.target.value), priceRange[0] + 10000000);
                  handlePriceChange([priceRange[0], newMax]);
                }}
                className="absolute w-full h-2 top-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
              />
            </div>

            {/* Labels */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatPrice(minPrice)}</span>
              <span>{formatPrice(maxPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
