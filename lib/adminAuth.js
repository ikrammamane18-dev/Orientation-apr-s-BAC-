import jwt from 'jsonwebtoken';

/**
 * lib/adminAuth.js
 *
 * Vérifie le cookie de session admin dans une Route Handler. Réutilisé par
 * toutes les routes /api/admin/** qui modifient des données (défense en
 * profondeur, en plus de middleware.js qui protège déjà les pages /admin/**).
 */
export function estSessionAdminValide(request) {
  const token = request.cookies.get('admin_session')?.value;
  try {
    jwt.verify(token ?? '', process.env.ADMIN_JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
