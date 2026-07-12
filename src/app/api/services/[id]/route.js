import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req, { params }) {
  await dbConnect();
  const service = await Service.findById(params.id).lean();
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ service });
}

export async function PUT(req, { params }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await req.json();

  try {
    const service = await Service.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, service });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A service with this slug already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  await Service.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
