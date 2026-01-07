import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, createPropertyInquiryEmail, createCustomerConfirmationEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { propertyId, propertyTitle, name, email, phone, message } = body;

        // Validate required fields
        if (!propertyId || !propertyTitle || !name || !email || !phone || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Fetch property details from database
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: {
                images: true,
                price: true,
                district: true,
                sector: true,
                status: true,
            },
        });

        const propertyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/properties/${propertyId}`;

        // Format price
        const formatPrice = (price: number, status: string) => {
            const formatted = new Intl.NumberFormat('en-RW', {
                minimumFractionDigits: 0,
            }).format(price);
            if (status === 'FOR_RENT' || status === 'RENTED') {
                return `${formatted} RWF/month`;
            }
            return `${formatted} RWF`;
        };

        const propertyImage = property?.images?.[0] || undefined;
        const propertyPrice = property ? formatPrice(property.price, property.status) : undefined;
        const propertyLocation = property ? `${property.sector}, ${property.district}` : undefined;

        // Save inquiry to database
        const inquiry = await prisma.propertyInquiry.create({
            data: {
                propertyId,
                name,
                email,
                phone,
                message,
                status: 'PENDING',
            },
        });

        // Send email to property owner/agent (or hardcoded email as requested)
        const ownerEmailResult = await sendEmail({
            to: 'macssrealestate@gmail.com',
            subject: `New Property Inquiry - ${propertyTitle}`,
            html: createPropertyInquiryEmail({
                propertyTitle,
                propertyId,
                propertyImage,
                propertyPrice,
                propertyLocation,
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                message,
                propertyUrl,
            }),
            replyTo: email,
        });

        // Send confirmation email to customer
        const customerEmailResult = await sendEmail({
            to: email,
            subject: `Thank you for your inquiry - ${propertyTitle}`,
            html: createCustomerConfirmationEmail({
                customerName: name,
                propertyTitle,
                propertyUrl,
                propertyImage,
            }),
        });

        if (ownerEmailResult.success && customerEmailResult.success) {
            return NextResponse.json({
                success: true,
                message: 'Your inquiry has been sent successfully!',
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to send email. Please try again.' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error in contact API:', error);
        return NextResponse.json(
            {
                error: 'An error occurred. Please try again later.',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
