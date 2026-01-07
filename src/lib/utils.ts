import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in Rwandan Francs
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price);
}

// Format area
export function formatArea(area: number): string {
  return `${area.toLocaleString()} m²`;
}

// Create URL slug from string
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Format phone number for WhatsApp
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Add Rwanda country code if not present
  if (!cleaned.startsWith('250')) {
    return `250${cleaned}`;
  }
  return cleaned;
}

// Generate WhatsApp link
export function getWhatsAppLink(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${formattedPhone}${encodedMessage}`;
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Generate property meta description
export function generatePropertyMetaDescription(property: {
  type: string;
  location: string;
  price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area: number;
}): string {
  const parts = [
    property.type,
    'for sale in',
    property.location,
    'Rwanda',
  ];

  if (property.bedrooms) {
    parts.push(`- ${property.bedrooms} bedrooms`);
  }

  if (property.bathrooms) {
    parts.push(`${property.bathrooms} bathrooms`);
  }

  parts.push(`${formatArea(property.area)}`);
  parts.push(`Price: ${formatPrice(property.price)}`);

  return parts.join(' ');
}

// Rwanda districts for SEO
export const RWANDA_DISTRICTS = [
  'Kigali',
  'Gasabo',
  'Kicukiro',
  'Nyarugenge',
  'Rwamagana',
  'Nyagatare',
  'Kayonza',
  'Kirehe',
  'Ngoma',
  'Bugesera',
  'Kamonyi',
  'Muhanga',
  'Ruhango',
  'Nyanza',
  'Gisagara',
  'Huye',
  'Nyaruguru',
  'Nyamagabe',
  'Rusizi',
  'Nyamasheke',
  'Karongi',
  'Rutsiro',
  'Rubavu',
  'Ngororero',
  'Musanze',
  'Burera',
  'Gicumbi',
  'Rulindo',
  'Gakenke',
];

// Rwanda real estate keywords for SEO
export const RWANDA_REAL_ESTATE_KEYWORDS = [
  'real estate Rwanda',
  'property Rwanda',
  'houses for sale Rwanda',
  'land for sale Rwanda',
  'apartments Rwanda',
  'rent house Kigali',
  'buy property Rwanda',
  'Rwanda real estate agents',
  'commercial property Rwanda',
  'warehouse rental Rwanda',
  'office space Kigali',
  'residential property Rwanda',
  'affordable housing Rwanda',
  'luxury homes Kigali',
  'investment property Rwanda',
  'plot for sale Rwanda',
  'furnished apartments Kigali',
  'villa for sale Rwanda',
];
