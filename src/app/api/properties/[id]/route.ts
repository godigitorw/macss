import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/properties/[id] - Fetch a single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.property.update({
      where: { id: params.id },
      data: { views: property.views + 1 },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update a property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const property = await prisma.property.update({
      where: {
        id: params.id,
      },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        bedrooms: body.bedrooms ? parseInt(body.bedrooms) : undefined,
        bathrooms: body.bathrooms ? parseInt(body.bathrooms) : undefined,
        area: body.area ? parseFloat(body.area) : undefined,
        parkingSpaces: body.parkingSpaces ? parseInt(body.parkingSpaces) : undefined,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete a property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.property.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
