import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';
import Order from '@/models/Order';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export default async function AdminDashboard() {
  await dbConnect();
  const [serviceCount, productCount, orderCount, newOrderCount, recentOrders] = await Promise.all([
    Service.countDocuments({ category: 'service' }),
    Service.countDocuments({ category: 'product' }),
    Order.countDocuments({}),
    Order.countDocuments({ status: 'new' }),
    Order.find({}).sort({ createdAt: -1 }).limit(5).lean()
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Services" value={serviceCount} icon="🔮" />
        <StatCard label="Products" value={productCount} icon="📦" />
        <StatCard label="Total Enquiries" value={orderCount} icon="📩" />
        <StatCard label="New Enquiries" value={newOrderCount} icon="🆕" highlight />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-maroon">Recent Enquiries</h2>
          <Link href="/admin/orders" className="text-saffron text-sm font-medium hover:underline">
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">No enquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Service</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id.toString()} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{o.name}</td>
                    <td className="py-2 pr-4">{o.serviceTitle}</td>
                    <td className="py-2 pr-4">{o.phone}</td>
                    <td className="py-2 pr-4 capitalize">{o.status.replace('_', ' ')}</td>
                    <td className="py-2 pr-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight }) {
  return (
    <div className={`rounded-xl shadow p-5 ${highlight ? 'bg-saffron text-white' : 'bg-white'}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-sm ${highlight ? 'text-white/90' : 'text-gray-500'}`}>{label}</div>
    </div>
  );
}
