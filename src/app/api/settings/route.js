import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import SiteSettings from '@/models/SiteSettings';
import { getAdminFromCookies } from '@/lib/auth';
import { getSiteSettings } from '@/lib/siteSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  delete body._id;
  delete body.createdAt;
  delete body.updatedAt;

  const settings = await SiteSettings.findByIdAndUpdate('site', body, {
    new: true,
    upsert: true,
    runValidators: true
  });

  return NextResponse.json({ success: true, settings });
}
