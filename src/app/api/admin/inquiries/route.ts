import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/inquiries - Fetch all inquiries
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
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { property: { title: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const inquiries = await prisma.propertyInquiry.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        images: true,
                        price: true,
                    },
                },
            },
        });

        return NextResponse.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inquiries' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/inquiries - Update inquiry status
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

        const inquiry = await prisma.propertyInquiry.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(inquiry);
    } catch (error) {
        console.error('Error updating inquiry:', error);
        return NextResponse.json(
            { error: 'Failed to update inquiry' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/inquiries - Delete inquiry
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

        await prisma.propertyInquiry.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        return NextResponse.json(
            { error: 'Failed to delete inquiry' },
            { status: 500 }
        );
    }
}
