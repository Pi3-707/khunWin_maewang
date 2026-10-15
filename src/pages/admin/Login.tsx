import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './admin.css';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // Already signed in: go straight to the product manager.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) nav('/admin/products', { replace: true }); });
  }, [nav]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    else nav('/admin/products');
  }

  return (
    <div className="adm adm-login">
      <form className="adm-card adm-login-card" onSubmit={submit}>
        <img src="/emblem.jpg" alt="" className="adm-emblem" />
        <h1>เข้าสู่ระบบเจ้าหน้าที่</h1>
        <p className="muted">ขุนวินแม่วาง · ระบบจัดการสินค้า</p>
        <label className="adm-field">
          <span>อีเมล</span>
          <input type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="adm-field">
          <span>รหัสผ่าน</span>
          <div className="adm-pass">
            <input type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="adm-pass-toggle" onClick={() => setShow(!show)} aria-pressed={show}>{show ? 'ซ่อน' : 'แสดง'}</button>
          </div>
        </label>
        {msg && <p className="adm-alert adm-alert-error" role="alert">{msg}</p>}
        <button className="btn adm-wide" type="submit" disabled={busy}>{busy ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}</button>
        <Link to="/" className="adm-back">← กลับไปหน้าเว็บไซต์</Link>
      </form>
    </div>
  );
}
