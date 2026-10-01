import { NextResponse } from 'next/server';
import { prisma } from '@germina-talks/db';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    
    // Simulate user context
    const userRole = formData.get('userRole') as string || 'student';
    const uploadedById = formData.get('uploadedById') as string;
    const caption = formData.get('caption') as string || undefined;
    const file = formData.get('file') as File;

    if (!uploadedById) {
      return NextResponse.json({ error: 'uploadedById is required' }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    
    // Ensure dir exists (it was created via task 1.1, but just to be safe if running elsewhere)
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);
    const url = `/uploads/${fileName}`;

    const status = userRole === 'student' ? 'PENDING' : 'APPROVED';

    const photo = await prisma.photo.create({
      data: {
        url,
        caption,
        albumId: params.id,
        uploadedById,
        status,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole') || 'student';
    
    const whereClause: any = { albumId: params.id };
    
    if (userRole === 'student') {
      whereClause.OR = [
        { status: 'APPROVED' },
        { uploadedById: userId }
      ];
    }

    const photos = await prisma.photo.findMany({
      where: whereClause,
      include: {
        uploadedBy: true
      }
    });

    return NextResponse.json(photos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to list photos' }, { status: 500 });
  }
}
