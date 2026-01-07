import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/property-types - Fetch all property types
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const activeOnly = searchParams.get('active') === 'true';

        const where = activeOnly ? { isActive: true } : {};

        const propertyTypes = await prisma.propertyTypeConfig.findMany({
            where,
            orderBy: {
                order: 'asc',
            },
        });

        return NextResponse.json(propertyTypes);
    } catch (error) {
        console.error('Error fetching property types:', error);
        return NextResponse.json(
            { error: 'Failed to fetch property types' },
            { status: 500 }
        );
    }
}

// POST /api/property-types - Create a new property type
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, displayName, description, icon, isActive, order } = body;

        // Validation
        if (!name || !displayName) {
            return NextResponse.json(
                { error: 'Name and display name are required' },
                { status: 400 }
            );
        }

        // Check if property type with this name already exists
        const existing = await prisma.propertyTypeConfig.findUnique({
            where: { name: name.toUpperCase() },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Property type with this name already exists' },
                { status: 400 }
            );
        }

        const propertyType = await prisma.propertyTypeConfig.create({
            data: {
                name: name.toUpperCase(),
                displayName,
                description,
                icon,
                isActive: isActive !== undefined ? isActive : true,
                order: order !== undefined ? order : 0,
            },
        });

        return NextResponse.json(propertyType, { status: 201 });
    } catch (error) {
        console.error('Error creating property type:', error);
        return NextResponse.json(
            { error: 'Failed to create property type' },
            { status: 500 }
        );
    }
}
