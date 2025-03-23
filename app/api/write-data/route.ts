import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = './match_data.json'; // Define the file path

    // Convert data to JSON string
    const jsonData = JSON.stringify(data, null, 2);

    // Write the JSON data to the file
    await writeFile(filePath, jsonData);

    console.log('Data written to file:', filePath);

    return NextResponse.json({ message: 'Data written to file' });
  } catch (error) {
    console.error('Error writing data to file:', error);
    return NextResponse.json({ error: 'Failed to write data to file' }, { status: 500 });
  }
}
