import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function RequireAuth({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'in' | 'out'>('loading');
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState(data.session ? 'in' : 'out'));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setState(s ? 'in' : 'out'));
    return () => data.subscription.unsubscribe();
  }, []);
  if (state === 'loading') return <p>กำลังโหลด…</p>;
  return state === 'in' ? <>{children}</> : <Navigate to="/admin" replace />;
}
