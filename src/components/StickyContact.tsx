import { ContactButtons } from './ContactButtons';

export function StickyContact({ productName }: { productName?: string }) {
  return (
    <div className="sticky-contact">
      <ContactButtons productName={productName} />
    </div>
  );
}
