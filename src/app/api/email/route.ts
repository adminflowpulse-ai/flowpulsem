import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendEmail({ to, subject, html });

    if (result.success) {
      return NextResponse.json({ message: 'Email sent successfully', previewUrl: result.previewUrl });
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
