import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Order from '@/models/Order';
import { sendMail } from '@/lib/mail';
import { getSiteSettings } from '@/lib/siteSettings';
import { getAdminFromCookies } from '@/lib/auth';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

const orderSchema = z.object({
  service: z.string().min(1),
  serviceTitle: z.string().min(1),
  name: z.string().min(1),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  phone: z.string().refine((val) => isValidPhoneNumber(val), { message: 'Invalid phone number' }),
  whatsapp: z.union([z.string().refine((val) => isValidPhoneNumber(val), { message: 'Invalid WhatsApp number' }), z.literal('')]).optional(),
  dob: z.string().optional(),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
  message: z.string().optional(),
  locale: z.string().optional()
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    await dbConnect();
    const order = await Order.create(data);
    const settings = await getSiteSettings();

    const notifyHtml = `
      <h2>New Service Enquiry</h2>
      <p><strong>Service:</strong> ${data.serviceTitle}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ''}
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.whatsapp ? `<p><strong>WhatsApp:</strong> ${data.whatsapp}</p>` : ''}
      ${data.dob ? `<p><strong>Date of Birth:</strong> ${data.dob}</p>` : ''}
      ${data.birthTime ? `<p><strong>Birth Time:</strong> ${data.birthTime}</p>` : ''}
      ${data.birthPlace ? `<p><strong>Birth Place:</strong> ${data.birthPlace}</p>` : ''}
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
    `;

    const userHtml = `
      <h2>Thank you for contacting ${settings.siteName}</h2>
      <p>Dear ${data.name},</p>
      <p>We have received your request for <strong>${data.serviceTitle}</strong>. Our team will contact you shortly on your phone/WhatsApp/email.</p>
      <p>Contact us anytime: ${settings.contact.phone} | ${settings.contact.email}</p>
    `;

    const notifyTo = process.env.NOTIFY_EMAIL || settings.contact.email;
    const adminMailOk = await sendMail({
      to: notifyTo,
      subject: `New Enquiry: ${data.serviceTitle} - ${data.name}`,
      html: notifyHtml
    });
    if (data.email) {
      await sendMail({
        to: data.email,
        subject: `We received your request - ${settings.siteName}`,
        html: userHtml
      });
    }

    if (adminMailOk) {
      order.emailSent = true;
      await order.save();
    }

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      adminWhatsapp: settings.contact.whatsappNumber
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req) {
  const admin = getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const status = searchParams.get('status');

  const filter = {};
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('service', 'title slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter)
  ]);

  return NextResponse.json({ orders, total, page, limit });
}
