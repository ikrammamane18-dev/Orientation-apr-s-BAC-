// Rate limiter simple en mémoire
const rateMap = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const userRecord = rateMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > userRecord.resetTime) {
    userRecord.count = 0;
    userRecord.resetTime = now + windowMs;
  }

  userRecord.count += 1;
  rateMap.set(ip, userRecord);

  return {
    success: userRecord.count <= limit,
    remaining: Math.max(0, limit - userRecord.count),
  };
}