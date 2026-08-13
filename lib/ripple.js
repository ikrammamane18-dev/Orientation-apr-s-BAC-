/**
 * lib/ripple.js
 * À utiliser sur un bouton qui a déjà `relative overflow-hidden` en classes
 * Tailwind : <button onMouseDown={creerRipple} className="relative overflow-hidden ...">
 */
export function creerRipple(event) {
  const bouton = event.currentTarget;
  const rect = bouton.getBoundingClientRect();
  const diametre = Math.max(rect.width, rect.height);
  const rayon = diametre / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  ripple.style.width = ripple.style.height = `${diametre}px`;
  ripple.style.left = `${event.clientX - rect.left - rayon}px`;
  ripple.style.top = `${event.clientY - rect.top - rayon}px`;

  bouton.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}
