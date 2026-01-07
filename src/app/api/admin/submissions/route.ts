import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/submissions - Fetch all property submissions
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const where: any = {};

        if (status && status !== 'all') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { contactName: { contains: search, mode: 'insensitive' } },
                { contactEmail: { contains: search, mode: 'insensitive' } },
                { district: { contains: search, mode: 'insensitive' } },
            ];
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

// PUT /api/admin/submissions - Update submission status
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'ID and status are required' },
                { status: 400 }
            );
        }

        // Standard status update
        let result;

        if (status === 'APPROVED') {
            // If approving, we need to creating a Property record
            // 1. Get the submission details
            const submission = await prisma.propertySubmission.findUnique({
                where: { id },
            });

            if (!submission) {
                return NextResponse.json(
                    { error: 'Submission not found' },
                    { status: 404 }
                );
            }

            // 2. Ensure we have a user to assign the property to
            // If submission has a user, use that. If not, use/create the admin user.
            let userId = submission.userId;

            if (!userId) {
                // Find or create admin user for anonymous submissions
                const adminEmail = 'admin@macssrealestate.rw';
                let adminUser = await prisma.user.findUnique({
                    where: { email: adminEmail },
                });

                if (!adminUser) {
                    console.log('Creating admin user for property assignment');
                    // Create a placeholder admin user if it doesn't exist
                    // Note: In a real app, you'd want proper password hashing
                    // This is a fallback to ensure we can create the property
                    try {
                        adminUser = await prisma.user.create({
                            data: {
                                email: adminEmail,
                                name: 'Admin',
                                password: 'hashed_placeholder_password', // Placeholder
                                role: 'ADMIN',
                            },
                        });
                    } catch (e) {
                        // If race condition or create fails, try to find one more time or fail
                        adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
                        if (!adminUser) throw new Error('Failed to assign user to property');
                    }
                }
                userId = adminUser!.id;
            }

            // 3. Map Property Type (String -> Enum)
            const propertyTypeMap: Record<string, any> = {
                'house': 'HOUSE',
                'apartment': 'APARTMENT',
                'land': 'LAND',
                'commercial': 'COMMERCIAL',
                'office': 'OFFICE',
                'warehouse': 'WAREHOUSE',
            };
            const mappedType = propertyTypeMap[submission.propertyType.toLowerCase()] || 'HOUSE';

            // 4. Map Listing Type (String -> PropertyStatus Enum)
            // submission.listingType is mostly 'FOR_RENT' or 'FOR_SALE'
            const listingTypeMap: Record<string, any> = {
                'FOR_RENT': 'FOR_RENT',
                'FOR_SALE': 'FOR_SALE',
                'rent': 'FOR_RENT',
                'sale': 'FOR_SALE',
            };
            const mappedStatus = listingTypeMap[submission.listingType] || 'FOR_SALE';


            // 5. Create Property and Update Submission in a transaction
            result = await prisma.$transaction(async (tx) => {
                // Create Property
                const newProperty = await tx.property.create({
                    data: {
                        title: submission.title,
                        description: submission.description,
                        type: mappedType,
                        status: mappedStatus,
                        price: parseFloat(submission.price) || 0,

                        // Location
                        district: submission.district,
                        sector: submission.sector,
                        address: submission.address,

                        // Details (Parse strings to numbers)
                        bedrooms: submission.bedrooms ? parseInt(submission.bedrooms) : null,
                        bathrooms: submission.bathrooms ? parseInt(submission.bathrooms) : null,
                        area: submission.area ? parseFloat(submission.area) : null,
                        parkingSpaces: submission.parkingSpaces ? parseInt(submission.parkingSpaces) : null,

                        // Features
                        amenities: submission.amenities,
                        images: submission.images,

                        // Contact (Map from Owner)
                        contactName: submission.ownerName,
                        contactEmail: submission.ownerEmail,
                        contactPhone: submission.ownerPhone,

                        // Meta
                        featured: false,
                        views: 0,
                        userId: userId!,
                    }
                });

                // Update Submission Status
                const updatedSubmission = await tx.propertySubmission.update({
                    where: { id },
                    data: { status },
                });

                return updatedSubmission;
            });

        } else {
            // Just update status if not approving
            result = await prisma.propertySubmission.update({
                where: { id },
                data: { status },
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error updating submission:', error);
        return NextResponse.json(
            { error: 'Failed to update submission', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/submissions - Delete submission
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        await prisma.propertySubmission.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting submission:', error);
        return NextResponse.json(
            { error: 'Failed to delete submission' },
            { status: 500 }
        );
    }
}
