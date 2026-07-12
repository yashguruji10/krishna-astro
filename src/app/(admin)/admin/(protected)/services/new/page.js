import ServiceForm from '@/components/admin/ServiceForm';

export const dynamic = 'force-dynamic';
export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon mb-6">Add Service / Product</h1>
      <ServiceForm />
    </div>
  );
}
