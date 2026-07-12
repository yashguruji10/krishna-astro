import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Order from '@/models/Order';
import { getAdminFromCookies } from '@/lib/auth';

export async function PATCH(req, { params }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  const allowedStatuses = ['new', 'contacted', 'in_progress', 'completed', 'cancelled'];
  if (!allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const order = await Order.findByIdAndUpdate(params.id, { status: body.status }, { new: true });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true, order });
}

export async function DELETE(req, { params }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  await Order.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
