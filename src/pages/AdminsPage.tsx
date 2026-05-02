import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';

interface Form {
  email: string;
  fullName: string;
  password: string;
  role: 'ADMIN' | 'SUB_ADMIN';
}

export const AdminsPage = () => {
  const { register, handleSubmit, reset, formState } = useForm<Form>({
    defaultValues: { role: 'SUB_ADMIN' },
  });

  const create = useMutation({
    mutationFn: (v: Form) => api.post('/admin/admins', v).then((r) => r.data),
    onSuccess: () => reset(),
  });

  return (
    <section className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold">Admins</h1>
      <p className="mt-1 text-sm text-slate-500">
        Only Super Admin can create Admin or Sub-Admin accounts.
      </p>
      <form onSubmit={handleSubmit((v) => create.mutate(v))} className="mt-6 space-y-3 card p-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input className="input mt-1" required {...register('fullName')} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" className="input mt-1" required {...register('email')} />
        </div>
        <div>
          <label className="text-sm font-medium">Temporary password</label>
          <input type="text" className="input mt-1" required minLength={8} {...register('password')} />
        </div>
        <div>
          <label className="text-sm font-medium">Role</label>
          <select className="input mt-1" {...register('role')}>
            <option value="SUB_ADMIN">Sub-admin</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button className="btn-primary" disabled={formState.isSubmitting || create.isPending}>
          {create.isPending ? 'Creating…' : 'Create admin'}
        </button>
        {create.isSuccess && <p className="text-sm text-emerald-600">Created.</p>}
        {create.isError && <p className="text-sm text-rose-600">{(create.error as Error).message}</p>}
      </form>
    </section>
  );
};
