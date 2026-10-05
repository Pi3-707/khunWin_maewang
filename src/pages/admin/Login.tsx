import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    else nav('/admin/products');
  }

  return (
    <form className="container" onSubmit={submit} style={{ maxWidth: 360 }}>
      <h1>เข้าสู่ระบบเจ้าหน้าที่</h1>
      <p><label>อีเมล<br /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} /></label></p>
      <p><label>รหัสผ่าน<br /><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} /></label></p>
      <button className="btn" type="submit">เข้าสู่ระบบ</button>
      {msg && <p className="error">{msg}</p>}
    </form>
  );
}
