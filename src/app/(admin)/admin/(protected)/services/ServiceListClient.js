'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ServiceListClient({ initialServices }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [error, setError] = useState('');

  async function toggleActive(service) {
    try {
      const res = await fetch(`/api/services/${service._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive })
      });
      if (!res.ok) throw new Error('Failed to update');
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch {
      setError('Failed to update status');
    }
  }

  async function handleDelete(service) {
    if (!confirm(`Delete "${service.title?.en}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/services/${service._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setServices((prev) => prev.filter((s) => s._id !== service._id));
    } catch {
      setError('Failed to delete service');
    }
  }

  return (
    <div className="card overflow-x-auto">
      {error && <p className="text-red-600 text-sm p-4">{error}</p>}
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="text-left text-gray-500 border-b bg-gray-50">
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4">Title (EN)</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Order</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id} className="border-b last:border-0">
              <td className="py-2 px-4">
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                  {service.image ? (
                    <Image src={service.image} alt={service.title?.en} fill className="object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-xl">🔮</span>
                  )}
                </div>
              </td>
              <td className="py-2 px-4 font-medium">{service.title?.en}</td>
              <td className="py-2 px-4 capitalize">{service.category}</td>
              <td className="py-2 px-4">{service.price > 0 ? `₹${service.price}` : 'On Request'}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => toggleActive(service)}
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Hidden'}
                </button>
              </td>
              <td className="py-2 px-4">{service.order}</td>
              <td className="py-2 px-4 space-x-2 whitespace-nowrap">
                <Link href={`/admin/services/${service._id}`} className="text-saffron hover:underline">
                  Edit
                </Link>
                <button onClick={() => handleDelete(service)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-500">
                No services or products yet. Click &quot;Add New&quot; to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
