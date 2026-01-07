import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/property-types/[id] - Get a single property type
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const propertyType = await prisma.propertyTypeConfig.findUnique({
            where: { id: params.id },
        });

        if (!propertyType) {
            return NextResponse.json(
                { error: 'Property type not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(propertyType);
    } catch (error) {
        console.error('Error fetching property type:', error);
        return NextResponse.json(
            { error: 'Failed to fetch property type' },
            { status: 500 }
        );
    }
}

// PUT /api/property-types/[id] - Update a property type
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, displayName, description, icon, isActive, order } = body;

        // Check if property type exists
        const existing = await prisma.propertyTypeConfig.findUnique({
            where: { id: params.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Property type not found' },
                { status: 404 }
            );
        }

        // If name is being changed, check if new name already exists
        if (name && name.toUpperCase() !== existing.name) {
            const nameExists = await prisma.propertyTypeConfig.findUnique({
                where: { name: name.toUpperCase() },
            });

            if (nameExists) {
                return NextResponse.json(
                    { error: 'Property type with this name already exists' },
                    { status: 400 }
                );
            }
        }

        const propertyType = await prisma.propertyTypeConfig.update({
            where: { id: params.id },
            data: {
                ...(name && { name: name.toUpperCase() }),
                ...(displayName && { displayName }),
                ...(description !== undefined && { description }),
                ...(icon !== undefined && { icon }),
                ...(isActive !== undefined && { isActive }),
                ...(order !== undefined && { order }),
            },
        });

        return NextResponse.json(propertyType);
    } catch (error) {
        console.error('Error updating property type:', error);
        return NextResponse.json(
            { error: 'Failed to update property type' },
            { status: 500 }
        );
    }
}

// DELETE /api/property-types/[id] - Delete a property type
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if property type exists
        const existing = await prisma.propertyTypeConfig.findUnique({
            where: { id: params.id },
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Property type not found' },
                { status: 404 }
            );
        }

        await prisma.propertyTypeConfig.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Property type deleted successfully' });
    } catch (error) {
        console.error('Error deleting property type:', error);
        return NextResponse.json(
            { error: 'Failed to delete property type' },
            { status: 500 }
        );
    }
}
