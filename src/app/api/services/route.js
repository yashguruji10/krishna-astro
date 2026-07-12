import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const all = searchParams.get('all'); // admin requests all including inactive

  const filter = {};
  if (category) filter.category = category;

  const admin = getAdminFromCookies();
  if (!admin || !all) {
    filter.isActive = true;
  }

  const services = await Service.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json({ services });
}

export async function POST(req) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await req.json();

  if (!body.slug || !body.title?.en) {
    return NextResponse.json({ error: 'slug and English title are required' }, { status: 400 });
  }

  try {
    const service = await Service.create(body);
    return NextResponse.json({ success: true, service });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A service with this slug already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
