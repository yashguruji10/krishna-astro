import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';
import Link from 'next/link';
import ServiceListClient from './ServiceListClient';

export const dynamic = 'force-dynamic';
export default async function AdminServicesPage() {
  await dbConnect();
  const services = await Service.find({}).sort({ order: 1, createdAt: -1 }).lean();

  // Serialize for client component
  const serialized = services.map((s) => ({ ...s, _id: s._id.toString() }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-maroon">Services & Products</h1>
        <Link href="/admin/services/new" className="btn-primary text-sm !py-2">
          + Add New
        </Link>
      </div>

      <ServiceListClient initialServices={serialized} />
    </div>
  );
}
