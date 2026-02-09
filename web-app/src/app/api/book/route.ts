import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request: Request) {
  const data = await request.json();
  const { fullName, email, experience } = data;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    // 1. Save to Database
    await client.query(
      'INSERT INTO "Booking" ("fullName", "email", "experience", "status") VALUES ($1, $2, $3, $4)',
      [fullName, email, experience, 'pending']
    );

    console.log(`Booking saved: ${fullName} (${email}) for ${experience}`);

    // In a real scenario, you'd use nodemailer here.
    // For this task, we will report the booking to the commander who will send the email.
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.end();
  }
}
