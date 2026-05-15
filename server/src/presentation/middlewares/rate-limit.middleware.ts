// Rate Limiter — prevents abuse by limiting requests per IP
import rateLimit from 'express-rate-limit';

// General rate limit — 100 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests — please try again later' },
});

// Auth rate limit — stricter for login/signup (prevents brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts — please try again later' },
});
