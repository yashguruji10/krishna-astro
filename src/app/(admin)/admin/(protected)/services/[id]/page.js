import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';
import ServiceForm from '@/components/admin/ServiceForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export default async function EditServicePage({ params }) {
  await dbConnect();
  const service = await Service.findById(params.id).lean();
  if (!service) notFound();

  const serialized = { ...service, _id: service._id.toString() };

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon mb-6">Edit Service / Product</h1>
      <ServiceForm initial={serialized} />
    </div>
  );
}
