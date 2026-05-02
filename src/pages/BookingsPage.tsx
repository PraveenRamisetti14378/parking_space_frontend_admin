import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const BookingsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => (await api.get('/admin/bookings')).data,
  });
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold">Bookings</h1>
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
                <th>Ref</th>
                <th>Customer</th>
                <th>Location · Slot</th>
                <th>Window</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((b: any) => (
                <tr key={b.id}>
                  <td className="font-mono text-xs">{b.reference}</td>
                  <td>{b.user?.fullName}<div className="text-xs text-slate-500">{b.user?.email}</div></td>
                  <td>{b.slot?.location?.name} · {b.slot?.code}</td>
                  <td className="text-xs">
                    {new Date(b.startAt).toLocaleString()}<br />→ {new Date(b.endAt).toLocaleString()}
                  </td>
                  <td>₹{Number(b.totalAmount)}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};
