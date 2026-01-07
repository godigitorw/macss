import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

    // Increment views (non-blocking)
    // We don't await this to speed up the response
    prisma.property.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    }).catch(console.error);

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

    // Revalidate paths to clear cache
    revalidatePath('/properties');
    revalidatePath(`/properties/${params.id}`);
    revalidatePath('/admin/properties');
    revalidatePath(`/admin/properties/edit/${params.id}`);

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

    // Revalidate paths
    revalidatePath('/properties');
    revalidatePath('/admin/properties');

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
