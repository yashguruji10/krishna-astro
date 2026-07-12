import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';
import { getSiteSettings } from '@/lib/siteSettings';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  phone: z.string().refine((val) => isValidPhoneNumber(val), { message: 'Invalid phone number' }),
  message: z.string().optional(),
  locale: z.string().optional()
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const data = parsed.data;
    const settings = await getSiteSettings();

    const notifyTo = process.env.NOTIFY_EMAIL || settings.contact.email;
    await sendMail({
      to: notifyTo,
      subject: `New Contact Message - ${data.name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ''}
        <p><strong>Phone:</strong> ${data.phone}</p>
        ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
      `
    });

    return NextResponse.json({ success: true, adminWhatsapp: settings.contact.whatsappNumber });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
