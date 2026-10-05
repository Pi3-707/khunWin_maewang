import { useState } from 'react';
import { ContactButtons } from '../components/ContactButtons';
import { FacebookCard } from '../components/FacebookCard';
import { usePageTitle } from '../lib/usePageTitle';

export default function Contact() {
  usePageTitle('ติดต่อ');
  const [qr, setQr] = useState(true);
  return (
    <div className="container">
      <h1>ติดต่อเรา</h1>
      <p>ทักมาคุยหรือสอบถามสินค้าได้ทาง LINE และ Messenger หรือโทรหาเราโดยตรง</p>
      <ContactButtons />
      <div style={{ marginTop: 24, maxWidth: 420 }}><FacebookCard /></div>
      {qr && <img src="/line-qr.png" alt="QR code LINE" width={200} height={200} onError={() => setQr(false)} style={{ marginTop: 24 }} />}
    </div>
  );
}
