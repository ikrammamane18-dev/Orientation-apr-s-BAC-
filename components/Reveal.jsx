'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';

/**
 * components/Reveal.jsx
 * Équivalent React de class="reveal" data-delay="200" :
 *   <Reveal delay={200}>Contenu</Reveal>
 * "as" permet de choisir la balise (section, h1, div...).
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}
