import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/submissions - Fetch all property submissions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const submissions = await prisma.propertySubmission.findMany({
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

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// POST /api/submissions - Create a new property submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      propertyType,
      listingType,
      title,
      description,
      district,
      sector,
      address,
      bedrooms,
      bathrooms,
      area,
      parkingSpaces,
      price,
      negotiable,
      amenities,
      ownerName,
      ownerEmail,
      ownerPhone,
      additionalInfo,
      images,
      userId,
    } = body;

    // Validation
    const missingFields = [];
    if (!propertyType) missingFields.push('propertyType');
    if (!listingType) missingFields.push('listingType');
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!district) missingFields.push('district');
    if (!sector) missingFields.push('sector');
    if (!price) missingFields.push('price');
    if (!ownerName) missingFields.push('ownerName');
    if (!ownerEmail) missingFields.push('ownerEmail');
    if (!ownerPhone) missingFields.push('ownerPhone');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    try {
      const submission = await prisma.propertySubmission.create({
        data: {
          propertyType,
          listingType,
          title,
          description,
          district,
          sector,
          address: address || '',
          bedrooms,
          bathrooms,
          area,
          parkingSpaces,
          price,
          negotiable: negotiable || false,
          amenities: amenities || [],
          images: images || [],
          ownerName,
          ownerEmail,
          ownerPhone,
          additionalInfo,
          userId: userId || null,
        },
      });

      return NextResponse.json(submission, { status: 201 });
    } catch (dbError) {
      console.error('Database error creating submission:', dbError);
      return NextResponse.json(
        { error: 'Failed to create submission', details: dbError instanceof Error ? dbError.message : 'Unknown database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
