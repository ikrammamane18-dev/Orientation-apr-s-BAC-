import jwt from 'jsonwebtoken';

export function verifyAdminToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : request.cookies.get('admin_session')?.value;

    if (!token) return false;

    const decoded = jwt.verify(
      token, 
      process.env.ADMIN_JWT_SECRET || 'secret-key-fallback'
    );
    return decoded;
  } catch (error) {
    return false;
  }
}