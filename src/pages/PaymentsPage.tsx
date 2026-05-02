import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const PaymentsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => (await api.get('/admin/payments')).data,
  });
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-6 card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-5 w-full" />
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((p: any) => (
                <tr key={p.id}>
                  <td className="text-xs">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="font-mono text-xs">{p.providerOrderId ?? '—'}</td>
                  <td>{p.booking?.user?.fullName}<div className="text-xs text-slate-500">{p.booking?.user?.email}</div></td>
                  <td>₹{Number(p.amount)}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};
