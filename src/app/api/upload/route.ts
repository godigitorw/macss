import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate specific path/folder logic if needed, 
    // but Vercel Blob creates unique URLs automatically.
    // If you want to organize folders: 'properties/filename.jpg'
    const folder = (formData.get('folder') as string) || 'uploads';
    const originalName = filename || file.name;
    const blobPath = `${folder}/${Date.now()}-${originalName}`;

    // Upload to Vercel Blob
    const blob = await put(blobPath, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: originalName,
      path: blob.url, // Vercel Blob uses URL as identifier mostly
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Handle file deletion (Optional - Vercel Blob SDK also has 'del')
// We can implement DELETE if needed
import { del } from '@vercel/blob';

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json(); // Expecting the full URL

    if (!path) {
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      );
    }

    await del(path);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
