import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { AppShell } from '@/components/AppShell';
import { BookingsPage } from '@/pages/BookingsPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { AdminsPage } from '@/pages/AdminsPage';

const qc = new QueryClient();

const HydrateSession = () => {
  const setSession = useAuth((s) => s.setSession);
  useEffect(() => {
    api
      .get('/auth/me')
      .then((r) => setSession(r.data?.user ?? null))
      .catch(() => setSession(null));
  }, [setSession]);
  return null;
};

const Overview = () => (
  <section className="p-6">
    <h1 className="text-2xl font-bold">Overview</h1>
    <p className="mt-1 text-slate-500">Operational metrics will appear here.</p>
  </section>
);

const Vendors = () => {
  const client = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => (await api.get('/admin/vendors')).data,
  });
  const approve = useMutation({
    mutationFn: (id: string) => api.post(`/admin/vendors/${id}/approve`),
    onSuccess: () => client.invalidateQueries({ queryKey: ['vendors'] }),
  });
  const reject = useMutation({
    mutationFn: (id: string) => api.post(`/admin/vendors/${id}/reject`),
    onSuccess: () => client.invalidateQueries({ queryKey: ['vendors'] }),
  });
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold">Vendors</h1>
      <div className="mt-6 card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-5 w-2/3" />
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Email</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((v: any) => (
                <tr key={v.id}>
                  <td className="font-medium">{v.businessName}</td>
                  <td>{v.user?.email}</td>
                  <td>{v.status}</td>
                  <td className="text-right space-x-2">
                    <button className="btn-primary" onClick={() => approve.mutate(v.id)}>Approve</button>
                    <button className="btn-ghost" onClick={() => reject.mutate(v.id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <HydrateSession />
        <AppShell>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/admins" element={<AdminsPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
