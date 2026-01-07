import { DefaultSeoProps } from 'next-seo';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const defaultSEO: DefaultSeoProps = {
  defaultTitle: 'MAC SS Real Estate Rwanda - Houses for Sale in Rwanda & Kigali',
  titleTemplate: '%s | MAC SS Real Estate Rwanda',
  description:
    'Find Houses for sale in Rwanda and Kigali. MAC SS Real Estate is your trusted agency for houses, apartments, land, and commercial properties.',
  canonical: APP_URL,
  openGraph: {
    type: 'website',
    locale: 'en_RW',
    url: APP_URL,
    siteName: 'MAC SS Real Estate Rwanda',
    title: 'MAC SS Real Estate Rwanda - Houses for Sale in Kigali',
    description:
      'Find Houses for sale in Rwanda and Kigali. MAC SS Real Estate is your trusted agency for houses, apartments, land, and commercial properties.',
    images: [
      {
        url: `${APP_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'MAC SS Real Estate Rwanda',
      },
    ],
  },
  twitter: {
    handle: '@macssrwanda',
    site: '@macssrwanda',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content:
        'Houses for sale in Rwanda, Houses for sale in Kigali, real estate Rwanda, property Rwanda, land for sale Rwanda, apartments Kigali, rent house Kigali, buy property Rwanda, commercial property Rwanda, warehouse rental Rwanda, office space Kigali, MAC SS Real Estate, property investment Rwanda',
    },
    {
      name: 'author',
      content: 'MAC SS Real Estate Rwanda',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
    {
      name: 'theme-color',
      content: '#0284c7',
    },
    {
      name: 'geo.region',
      content: 'RW',
    },
    {
      name: 'geo.placename',
      content: 'Kigali',
    },
    {
      name: 'geo.position',
      content: '-1.9536;30.0606',
    },
    {
      name: 'ICBM',
      content: '-1.9536, 30.0606',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};

// Generate property-specific SEO
export function generatePropertySEO(property: {
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  images?: { url: string; alt?: string }[];
  slug: string;
}) {
  const url = `${APP_URL}/properties/${property.slug}`;
  const image = property.images?.[0]?.url || `${APP_URL}/images/property-placeholder.jpg`;

  return {
    title: `${property.title} - ${property.location}`,
    description: property.description.substring(0, 160),
    canonical: url,
    openGraph: {
      type: 'article' as const,
      url,
      title: property.title,
      description: property.description.substring(0, 160),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      article: {
        tags: [property.type, property.location, 'Rwanda Real Estate'],
      },
    },
  };
}

// Generate structured data for property
export function generatePropertyStructuredData(property: {
  title: string;
  description: string;
  price: number;
  location: string;
  images?: { url: string }[];
  bedrooms?: number | null;
  bathrooms?: number | null;
  area: number;
  address?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${APP_URL}/properties`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressCountry: 'RW',
      streetAddress: property.address || property.location,
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'RWF',
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'MTK',
    },
    image: property.images?.map((img) => img.url) || [],
  };
}

// Organization structured data
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'MAC SS Real Estate Rwanda',
  description:
    'Leading real estate agency in Rwanda offering land, houses, apartments, warehouses, and commercial properties for sale and rent.',
  url: APP_URL,
  telephone: '+250 786 703 130',
  email: 'macssrealestate@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'KG 11 IKAZE HOUSE 3RD FLOOR No 2',
    addressLocality: 'Kigali',
    addressCountry: 'RW',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-1.9536',
    longitude: '30.0606',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Rwanda',
  },
  sameAs: [
    // Add social media links here when available
  ],
};
