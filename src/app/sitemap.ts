
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://macssrealestate.rw';

    // Static routes
    const routes = [
        '',
        '/about',
        '/properties',
        '/contact',
        '/list-property',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes (Properties)
    const properties = await prisma.property.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
    });

    const propertyRoutes = properties.map((property) => ({
        url: `${baseUrl}/properties/${property.id}`,
        lastModified: property.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...propertyRoutes];
}
