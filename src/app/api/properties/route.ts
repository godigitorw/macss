import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/properties - Fetch all properties with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const district = searchParams.get('district');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (district) {
      where.district = {
        equals: district,
        mode: 'insensitive',
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { district: { contains: search, mode: 'insensitive' } },
        { sector: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
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

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      type,
      status,
      price,
      bedrooms,
      bathrooms,
      area,
      parkingSpaces,
      district,
      sector,
      address,
      images,
      amenities,
      contactName,
      contactEmail,
      contactPhone,
      userId,
      featured,
    } = body;

    // Validation
    if (!title || !description || !type || !status || !price || !district || !sector || !address || !contactName || !contactEmail || !contactPhone || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        type,
        status,
        price: parseFloat(price),
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        area: area ? parseFloat(area) : null,
        parkingSpaces: parkingSpaces ? parseInt(parkingSpaces) : null,
        district,
        sector,
        address,
        images: images || [],
        amenities: amenities || [],
        contactName,
        contactEmail,
        contactPhone,
        userId,
        featured: featured || false,
      },
    });

    // Revalidate paths
    revalidatePath('/properties');
    revalidatePath('/admin/properties');

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
