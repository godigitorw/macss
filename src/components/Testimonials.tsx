'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  rating: number;
  comment: string;
  image: string;
  propertyType?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Jean Claude Mugabo',
    role: 'Business Owner',
    company: 'Tech Solutions Ltd',
    rating: 5,
    comment: 'MAC SS Real Estate helped me find the perfect office space for my growing business. Their professionalism and market knowledge are exceptional. Highly recommended!',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    propertyType: 'Office Space',
  },
  {
    id: '2',
    name: 'Sarah Uwase',
    role: 'Homeowner',
    rating: 5,
    comment: 'I purchased my dream home through MAC SS and the entire process was smooth and transparent. The team went above and beyond to ensure I got the best deal. Thank you!',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    propertyType: 'Family Home',
  },
  {
    id: '3',
    name: 'Patrick Nshuti',
    role: 'Investor',
    rating: 5,
    comment: 'Outstanding service! MAC SS Real Estate provided excellent guidance on my property investment. Their attention to detail and commitment to client satisfaction is unmatched.',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    propertyType: 'Commercial Property',
  },
  {
    id: '4',
    name: 'Grace Mukamana',
    role: 'Renter',
    rating: 5,
    comment: 'Finding an apartment in Kigali was stress-free thanks to MAC SS. They understood my needs and showed me properties that matched my budget perfectly. Great experience!',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    propertyType: 'Apartment',
  },
  {
    id: '5',
    name: 'David Mutabazi',
    role: 'Property Seller',
    rating: 5,
    comment: 'MAC SS sold my property within a month at a great price. Their marketing strategy and negotiation skills are top-notch. I would definitely work with them again.',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    propertyType: 'Villa',
  },
  {
    id: '6',
    name: 'Emmanuel Habimana',
    role: 'First-time Buyer',
    rating: 5,
    comment: 'As a first-time buyer, I was nervous about the process. MAC SS walked me through every step with patience and expertise. I couldn\'t have asked for better support!',
    image: 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    propertyType: 'Apartment',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Auto-scroll functionality with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [maxIndex, isPaused]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              What Our Clients Say
            </h2>
            <p className="text-base text-gray-600">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 disabled:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 disabled:border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-sm"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Carousel - Full Width */}
      <div
        className="relative mb-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-primary-400 transition-all duration-300 p-4 flex flex-col h-full">

              {/* Rating */}
              <div className="mb-3">{renderStars(testimonial.rating)}</div>

              {/* Comment */}
              <p className="text-sm text-gray-700 mb-4 flex-grow leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">{testimonial.role}</p>
                  {testimonial.propertyType && (
                    <p className="text-xs text-primary-600 mt-0.5">
                      {testimonial.propertyType}
                    </p>
                  )}
                </div>
              </div>
                </div>
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
      </div>
    </section>
  );
}
