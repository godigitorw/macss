'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import {
  FiMapPin,
  FiHome,
  FiMaximize2,
  FiCalendar,
  FiPhone,
  FiMail,
  FiShare2,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from 'react-icons/fi';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  status: 'FOR_SALE' | 'FOR_RENT' | 'SOLD' | 'RENTED';
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  parkingSpaces: number | null;
  district: string;
  sector: string;
  address: string;
  images: string[];
  amenities: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  featured: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);

          // Fetch related properties (same type)
          const relatedResponse = await fetch(`/api/properties?type=${data.type}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out current property and limit to 4
            const filtered = relatedData
              .filter((p: Property) => p.id !== propertyId)
              .slice(0, 4);
            setRelatedProperties(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFormMessage(null);

    try {
      const response = await fetch('/api/contact/property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property?.id,
          propertyTitle: property?.title,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormMessage({ type: 'success', text: 'Thank you! Your inquiry has been sent successfully. We will contact you soon.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFormMessage({ 
          type: 'error', 
          text: data.details ? `Error: ${data.details}` : (data.error || 'Failed to send inquiry. Please try again.') 
        });
      }
    } catch (error) {
      setFormMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <Link
              href="/properties"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Back to Properties
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const images = property.images.length > 0 ? property.images : ['https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp'];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('en-RW', {
      minimumFractionDigits: 0,
    }).format(price);

    if (property.status === 'FOR_RENT' || property.status === 'RENTED') {
      return `${formatted} RWF/month`;
    }
    return `${formatted} RWF`;
  };

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

  // Format related properties for PropertyCard
  const formatPropertyForCard = (prop: Property) => ({
    id: prop.id,
    title: prop.title,
    price: formatPrice(prop.price),
    location: `${prop.sector}, ${prop.district}`,
    bedrooms: prop.bedrooms || 0,
    bathrooms: prop.bathrooms || 0,
    area: prop.area ? `${prop.area} m²` : 'N/A',
    type: prop.type.toLowerCase(),
    status: prop.status,
    image: prop.images[0] || 'https://macssproperties.b-cdn.net/house-for-rent-12-1-1170x650.webp',
    featured: prop.featured,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-primary-600">Properties</Link>
              <span>/</span>
              <span className="text-gray-900">{property.title}</span>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Column - Property Details */}
            <div>
              {/* Image Gallery */}
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mb-6">
                {/* Main Image */}
                <div className="relative h-[400px] md:h-[500px] bg-gray-100">
                  <Image
                    src={images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <FiChevronLeft className="w-6 h-6 text-gray-900" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <FiChevronRight className="w-6 h-6 text-gray-900" />
                      </button>
                    </>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {property.featured && (
                    <div className="absolute top-4 left-28">
                      <span className="px-3 py-1.5 bg-primary-500 text-white rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                      <FiShare2 className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                      <FiHeart className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-sm rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-primary-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${property.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Info */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">{property.address}, {property.sector}, {property.district}</span>
                  </div>
                  <div className="text-3xl font-bold text-primary-600">{formatPrice(property.price)}</div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-gray-200">
                  {property.bedrooms && property.bedrooms > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                        <FiHome className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && property.bathrooms > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                        <FiMaximize2 className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                        <div className="text-sm text-gray-600">m² Area</div>
                      </div>
                    </div>
                  )}
                  {property.parkingSpaces && property.parkingSpaces > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{property.parkingSpaces}</div>
                        <div className="text-sm text-gray-600">Parking</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                  <div 
                    className="text-gray-700 leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </div>
              </div>

              {/* Features & Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact & Agent */}
            <div>
              {/* Contact Form */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 sticky top-24">


                <h2 className="text-xl font-bold text-gray-900 mb-4">Interested in this property?</h2>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="+250 788 000 000"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={4}
                      placeholder="I'm interested in this property..."
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    ></textarea>
                  </div>

                  {formMessage && (
                    <div className={`p-4 rounded-lg ${
                      formMessage.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      <p className="text-sm">{formMessage.text}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>

                {/* Contact Buttons */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <a
                    href={`tel:${property.contactPhone}`}
                    className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPhone className="w-5 h-5" />
                    Call Now
                  </a>
                  <a
                    href={`https://wa.me/${property.contactPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${property.contactEmail}?subject=Inquiry about ${property.title}`}
                    className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-5 h-5" />
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Properties */}
          {relatedProperties.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProperties.map((relatedProperty) => (
                  <PropertyCard key={relatedProperty.id} property={formatPropertyForCard(relatedProperty)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
