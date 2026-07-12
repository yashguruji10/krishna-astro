import { dbConnect } from '@/lib/dbConnect';
import Order from '@/models/Order';
import OrdersListClient from './OrdersListClient';

export const dynamic = 'force-dynamic';
export default async function AdminOrdersPage() {
  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

  const serialized = orders.map((o) => ({
    ...o,
    _id: o._id.toString(),
    service: o.service?.toString?.() || o.service,
    createdAt: o.createdAt?.toISOString()
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon mb-6">Orders / Enquiries</h1>
      <OrdersListClient initialOrders={serialized} />
    </div>
  );
}
