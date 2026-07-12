'use client';

import { useState } from 'react';
import { buildWhatsAppLink, buildOrderWhatsAppMessage } from '@/lib/whatsapp';

const STATUS_OPTIONS = ['new', 'contacted', 'in_progress', 'completed', 'cancelled'];

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-200 text-gray-600'
};

export default function OrdersListClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  async function updateStatus(orderId, status) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch {
      alert('Failed to update status');
    }
  }

  async function deleteOrder(orderId) {
    if (!confirm('Delete this enquiry?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch {
      alert('Failed to delete');
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`text-sm px-3 py-1.5 rounded-full font-medium ${filter === 'all' ? 'bg-saffron text-white' : 'bg-white border'}`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-full font-medium capitalize ${filter === s ? 'bg-saffron text-white' : 'bg-white border'}`}
          >
            {s.replace('_', ' ')} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => {
          const waLink = buildWhatsAppLink(order.whatsapp || order.phone, buildOrderWhatsAppMessage(order, order.serviceTitle));
          return (
            <div key={order._id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-maroon">{order.name}</p>
                  <p className="text-sm text-gray-500">{order.serviceTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full font-semibold border-0 ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    className="text-saffron text-sm hover:underline"
                  >
                    {expanded === order._id ? 'Hide' : 'Details'}
                  </button>
                </div>
              </div>

              {expanded === order._id && (
                <div className="mt-3 pt-3 border-t grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  {order.whatsapp && <p><strong>WhatsApp:</strong> {order.whatsapp}</p>}
                  {order.dob && <p><strong>Date of Birth:</strong> {order.dob}</p>}
                  {order.birthTime && <p><strong>Birth Time:</strong> {order.birthTime}</p>}
                  {order.birthPlace && <p><strong>Birth Place:</strong> {order.birthPlace}</p>}
                  {order.message && <p className="sm:col-span-2"><strong>Message:</strong> {order.message}</p>}
                  <p><strong>Email Sent:</strong> {order.emailSent ? 'Yes' : 'No'}</p>
                  <p><strong>Language:</strong> {order.locale}</p>

                  <div className="sm:col-span-2 flex gap-3 mt-2">
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-secondary !bg-[#25D366] text-sm !py-1.5">
                      WhatsApp
                    </a>
                    <a href={`mailto:${order.email}`} className="btn-secondary text-sm !py-1.5">
                      Email
                    </a>
                    <button onClick={() => deleteOrder(order._id)} className="btn-danger text-sm !py-1.5">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">No enquiries in this category.</p>
        )}
      </div>
    </div>
  );
}
