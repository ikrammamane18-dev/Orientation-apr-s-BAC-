'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { creerRipple } from '@/lib/ripple';

/**
 * components/RippleLink.jsx
 * Combine Reveal + ripple pour un lien, tout en restant côté client de bout
 * en bout — évite de faire transiter une fonction (creerRipple) depuis un
 * composant serveur (app/page.jsx n'a pas 'use client'), ce que Next.js
 * n'autorise pas.
 */
export default function RippleLink({ href, children, delay = 0, className = '' }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <Link
      ref={ref}
      href={href}
      onMouseDown={creerRipple}
      className={`reveal ${isVisible ? 'reveal-visible' : ''} relative overflow-hidden ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Link>
  );
}
