import { NextRequest, NextResponse } from 'next/server';
import { convertEnexToJson } from '@/lib/enex-converter';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        
        const content = await file.text();
        const exportInfo = await convertEnexToJson(content);
        
        // Here you would typically save the data to your database
        // For example, using MongoDB:
        // await db.collection('notes').insertMany(exportInfo.notes);
        
        return NextResponse.json({
            message: 'Import successful',
            data: exportInfo
        });
        
    } catch (error) {
        console.error('Error importing ENEX file:', error);
        return NextResponse.json(
            { error: 'Failed to process ENEX file' },
            { status: 500 }
        );
    }
}
