'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
  status: string;
  type: string; // The internal name (e.g. HOUSE)
}

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  
  // Initialize price from URL or defaults
  const urlMinPrice = searchParams.get('minPrice');
  const urlMaxPrice = searchParams.get('maxPrice');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice ? parseInt(urlMinPrice) : 0,
    urlMaxPrice ? parseInt(urlMaxPrice) : 1000000000
  ]);

  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  
  // Available limits from data
  const [dataMinPrice, setDataMinPrice] = useState(0);
  const [dataMaxPrice, setDataMaxPrice] = useState(1000000000);

  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Sync State FROM URL when it changes (e.g. Back button, navigation from Hero)
  useEffect(() => {
    const newStatus = searchParams.get('status') || '';
    const newType = searchParams.get('type') || '';
    const newDistrict = searchParams.get('district') || '';
    const newMin = searchParams.get('minPrice');
    const newMax = searchParams.get('maxPrice');

    if (newStatus !== status) setStatus(newStatus);
    if (newType !== type) setType(newType);
    if (newDistrict !== district) setDistrict(newDistrict);
    
    // Only update price if it's not being dragged to avoid fighting
    if (!isDragging) {
      setPriceRange([
        newMin ? parseInt(newMin) : dataMinPrice,
        newMax ? parseInt(newMax) : dataMaxPrice
      ]);
    }
  }, [searchParams, isDragging, dataMinPrice, dataMaxPrice]);

  // 2. Fetch Initial Data
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        const [typesRes, propsRes] = await Promise.all([
          fetch('/api/property-types?active=true'),
          fetch('/api/properties')
        ]);

        if (typesRes.ok) {
          setPropertyTypes(await typesRes.json());
        }

        if (propsRes.ok) {
          const properties: Property[] = await propsRes.json();
          setAllProperties(properties);

          if (properties.length > 0) {
            const prices = properties.map(p => p.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            
            // Round to nearest 10M
            const roundedMin = Math.floor(min / 10000000) * 10000000;
            const roundedMax = Math.ceil(max / 10000000) * 10000000;
            
            setDataMinPrice(roundedMin);
            setDataMaxPrice(roundedMax);

            // If URL didn't have price, set range to data limits
            if (!urlMinPrice && !urlMaxPrice) {
              setPriceRange([roundedMin, roundedMax]);
            }
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

  // 3. Dependent Facets: Update available districts based on selected Type/Status
  useEffect(() => {
    if (allProperties.length === 0) return;

    let filtered = allProperties;

    // Filter by Status
    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }
    
    // Filter by Type (ensure case insensitive comparison if needed, but IDs/Enums usually exact)
    // Our API returns 'type' as the enum value (e.g. HOUSE).
    if (type) {
      filtered = filtered.filter(p => p.type === type);
    }

    const districts = Array.from(new Set(filtered.map(p => p.district)))
      .filter(Boolean)
      .sort();
      
    setAvailableDistricts(districts);
    
    // If current district is no longer valid, clear it? 
    // Maybe safer to keep it to avoid jarring resets, but standard behavior is usually to clear.
    // Let's check correctness: if I switch to "Rent" and my current district has no rentals, search returns 0.
    // That's acceptable. But better UX might be to clear it. For now, let's leave it to avoid "fighting".
  }, [allProperties, status, type]);

  // 4. Update URL Helper
  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    const newUrl = `/properties${queryString ? '?' + queryString : ''}`;
    
    // Use router.push for smooth client-side transition without reload
    router.push(newUrl, { scroll: false });
  };

  // 5. Handlers
  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    
    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);

    priceTimeoutRef.current = setTimeout(() => {
      updateUrl({
        minPrice: newRange[0] > dataMinPrice ? newRange[0].toString() : null,
        maxPrice: newRange[1] < dataMaxPrice ? newRange[1].toString() : null,
      });
    }, 800);
  };

  const clearFilters = () => {
    setStatus('');
    setType('');
    setDistrict('');
    setPriceRange([dataMinPrice, dataMaxPrice]);
    router.push('/properties', { scroll: false });
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
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
                onChange={(e) => updateUrl({ status: '' })}
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
                onChange={(e) => updateUrl({ status: 'FOR_SALE' })}
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
                onChange={(e) => updateUrl({ status: 'FOR_RENT' })}
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
            onChange={(e) => updateUrl({ type: e.target.value })}
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
            onChange={(e) => updateUrl({ district: e.target.value })}
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
            <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
              <span className="font-medium">{formatPrice(priceRange[0])}</span>
              <span className="text-gray-400">-</span>
              <span className="font-medium">{formatPrice(priceRange[1])}</span>
            </div>

            <div className="relative pt-2 pb-4">
              <div className="absolute top-2 left-0 right-0 h-2 bg-gray-200 rounded-lg"></div>
              <div
                className="absolute top-2 h-2 bg-primary-500 rounded-lg"
                style={{
                  left: `${((priceRange[0] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%`,
                  right: `${100 - ((priceRange[1] - dataMinPrice) / (dataMaxPrice - dataMinPrice)) * 100}%`,
                }}
              ></div>

              <input
                type="range"
                min={dataMinPrice}
                max={dataMaxPrice}
                step={Math.max(10000000, Math.floor((dataMaxPrice - dataMinPrice) / 100))}
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

              <input
                type="range"
                min={dataMinPrice}
                max={dataMaxPrice}
                step={Math.max(10000000, Math.floor((dataMaxPrice - dataMinPrice) / 100))}
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

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatPrice(dataMinPrice)}</span>
              <span>{formatPrice(dataMaxPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
