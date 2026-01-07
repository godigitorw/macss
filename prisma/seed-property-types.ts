import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPropertyTypes() {
    console.log('Seeding property types...');

    const propertyTypes = [
        {
            name: 'HOUSE',
            displayName: 'House',
            description: 'Residential houses including villas, bungalows, and family homes',
            icon: 'FiHome',
            order: 1,
        },
        {
            name: 'APARTMENT',
            displayName: 'Apartment',
            description: 'Apartments, flats, and condominiums',
            icon: 'FiGrid',
            order: 2,
        },
        {
            name: 'LAND',
            displayName: 'Land',
            description: 'Plots and land for development',
            icon: 'FiMap',
            order: 3,
        },
        {
            name: 'COMMERCIAL',
            displayName: 'Commercial',
            description: 'Commercial properties including shops, malls, and retail spaces',
            icon: 'FiShoppingBag',
            order: 4,
        },
        {
            name: 'OFFICE',
            displayName: 'Office',
            description: 'Office spaces and business centers',
            icon: 'FiBriefcase',
            order: 5,
        },
        {
            name: 'WAREHOUSE',
            displayName: 'Warehouse',
            description: 'Warehouses and industrial storage facilities',
            icon: 'FiPackage',
            order: 6,
        },
    ];

    for (const type of propertyTypes) {
        await prisma.propertyTypeConfig.upsert({
            where: { name: type.name },
            update: { icon: type.icon }, // Update icon to React Icon name
            create: type,
        });
    }

    console.log(`✓ Seeded ${propertyTypes.length} property types`);
}

seedPropertyTypes()
    .catch((e) => {
        console.error('Error seeding property types:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
