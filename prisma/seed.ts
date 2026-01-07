import { PrismaClient, PropertyType, PropertyStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@macssrealestate.rw' },
    update: {},
    create: {
      email: 'admin@macssrealestate.rw',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Clean up existing properties
  await prisma.property.deleteMany({});
  console.log('Cleared existing properties');

  // Create sample properties
  const properties = [
    {
      title: 'Modern Villa in Kacyiru',
      description: 'Luxurious 5-bedroom villa with stunning views in the heart of Kacyiru. Features a spacious living area, modern kitchen, private garden, and ample parking space.',
      type: PropertyType.HOUSE,
      status: PropertyStatus.FOR_SALE,
      price: 450000000,
      bedrooms: 5,
      bathrooms: 4,
      area: 500,
      parkingSpaces: 3,
      district: 'Gasabo',
      sector: 'Kacyiru',
      address: 'KG 123 St, Kacyiru',
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop'],
      amenities: ['Swimming Pool', 'Garden', 'Garage', 'Security', 'Generator'],
      contactName: 'MAC SS Real Estate',
      contactEmail: 'macssrealestate@gmail.com',
      contactPhone: '+250 786 703 130',
      featured: true,
      userId: admin.id,
    },
    {
      title: 'Luxury Apartment in Kimihurura',
      description: 'Spacious 3-bedroom apartment in a prime location. Modern finishes, secure compound with 24/7 security, and easy access to amenities.',
      type: PropertyType.APARTMENT,
      status: PropertyStatus.FOR_RENT,
      price: 1200000,
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      parkingSpaces: 2,
      district: 'Gasabo',
      sector: 'Kimihurura',
      address: 'KG 456 St, Kimihurura',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop'],
      amenities: ['Balcony', 'Parking', 'Security', 'Water Tank'],
      contactName: 'MAC SS Real Estate',
      contactEmail: 'info@macssrealestaterw.com',
      contactPhone: '+250788308043',
      featured: true,
      userId: admin.id,
    },
    {
      title: 'Commercial Space in Downtown Kigali',
      description: 'Prime commercial property in the CBD. Perfect for retail or office use. High foot traffic area with excellent visibility.',
      type: PropertyType.COMMERCIAL,
      status: PropertyStatus.FOR_SALE,
      price: 350000000,
      area: 250,
      parkingSpaces: 5,
      district: 'Nyarugenge',
      sector: 'Nyarugenge',
      address: 'KN 789 St, Downtown',
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop'],
      amenities: ['Parking', 'Security', 'Generator', 'Elevator'],
      contactName: 'MAC SS Real Estate',
      contactEmail: 'info@macssrealestaterw.com',
      contactPhone: '+250788308043',
      featured: false,
      userId: admin.id,
    },
    {
      title: 'Family Home in Remera',
      description: 'Beautiful 4-bedroom house in quiet neighborhood. Perfect for families. Close to schools and shopping centers.',
      type: PropertyType.HOUSE,
      status: PropertyStatus.FOR_SALE,
      price: 250000000,
      bedrooms: 4,
      bathrooms: 3,
      area: 300,
      parkingSpaces: 2,
      district: 'Gasabo',
      sector: 'Remera',
      address: 'KG 321 St, Remera',
      images: ['https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2574&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop'],
      amenities: ['Garden', 'Garage', 'Security', 'Water Tank'],
      contactName: 'MAC SS Real Estate',
      contactEmail: 'info@macssrealestaterw.com',
      contactPhone: '+250788308043',
      featured: false,
      userId: admin.id,
    },
    {
      title: 'Plot of Land in Kicukiro',
      description: 'Prime residential plot ready for development. Located in a growing area with all utilities available.',
      type: PropertyType.LAND,
      status: PropertyStatus.FOR_SALE,
      price: 180000000,
      area: 600,
      district: 'Kicukiro',
      sector: 'Kicukiro',
      address: 'KK 654 St, Kicukiro',
      images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop'],
      amenities: ['Electricity', 'Water', 'Road Access'],
      contactName: 'MAC SS Real Estate',
      contactEmail: 'info@macssrealestaterw.com',
      contactPhone: '+250788308043',
      featured: false,
      userId: admin.id,
    },
    {
      title: 'Office Space in Nyarutarama',
      description: 'Modern office space in premium location. Ideal for businesses. Fully equipped with modern amenities.',
      type: PropertyType.OFFICE,
      status: PropertyStatus.FOR_RENT,
      price: 2500000,
      area: 200,
      parkingSpaces: 4,
      district: 'Gasabo',
      sector: 'Nyarutarama',
      address: 'KG 987 St, Nyarutarama',
      images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2669&auto=format&fit=crop'],
      amenities: ['Parking', 'Security', 'Generator', 'Elevator', 'Conference Room'],
      contactName: 'MAC SS Real Estate',
      contactEmail: 'info@macssrealestaterw.com',
      contactPhone: '+250788308043',
      featured: true,
      userId: admin.id,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log(`Created ${properties.length} properties`);
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
