'use client';

import { usePathname } from 'next/navigation';
import CookieConsentBanner from './CookieConsentBanner';
import SiteFooter from './SiteFooter';

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const estAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {children}
      {!estAdmin && (
        <>
          <SiteFooter />
          <CookieConsentBanner />
        </>
      )}
    </>
  );
}
