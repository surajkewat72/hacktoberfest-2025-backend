import passport from '../config/passport.config.js';
import User from '../models/user.model.js';
import { generateToken } from '../config/passport.config.js';
import crypto from 'crypto';

// WARNING: cookie-parser middleware must be enabled in app.js for the state cookie to work
// e.g. app.use(cookieParser());

// Redirect to Google OAuth (generates a per-request state stored in an httpOnly cookie)
export const googleAuth = (req, res, next) => {
  const state = crypto.randomBytes(16).toString('hex');
  // store state in an httpOnly cookie for CSRF protection, short lived
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 5 * 60 * 1000 // 5 minutes
  });

  const authOptions = {
    scope: ['profile', 'email'],
    session: false,
    state,
    prompt: 'consent',
    accessType: 'offline'
  };
  return passport.authenticate('google', authOptions)(req, res, next);
};

// Handle Google OAuth callback (validate state cookie, then issue token)
export const googleCallback = (req, res, next) => {
  try {
    const stateCookie = req.cookies?.oauth_state;
    const stateQuery = req.query?.state;

    if (stateCookie && stateQuery !== stateCookie) {
      res.clearCookie('oauth_state');
      return res.status(403).json({ success: false, message: 'Invalid OAuth state' });
    }
    // clear cookie early
    res.clearCookie('oauth_state');

    passport.authenticate('google', { session: false }, async (err, user, info) => {
      if (err) {
        console.error('Google OAuth error (callback):', err?.stack || err);
        return res.status(500).json({ success: false, message: 'Authentication failed' });
      }

      if (!user) {
        if (info) console.info('Google OAuth info:', info);
        return res.status(401).json({ success: false, message: 'Authentication failed' });
      }

      try {
        await user.updateLastLogin?.();
        const token = generateToken(user);

        const frontend = process.env.FRONTEND_URL;
        if (frontend) {
          if (process.env.SEND_TOKEN_COOKIE === 'true') {
            res.cookie('token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.redirect(`${frontend}/auth/success`);
          }
          return res.redirect(`${frontend}/auth/success#token=${token}`);
        }

        // return safe public user view (include email for owner)
        return res.json({
          success: true,
          message: 'Authentication successful',
          token,
          user: user.toPublic(true)
        });
      } catch (error) {
        console.error('Post-auth processing error:', error?.stack || error);
        return res.status(500).json({ success: false, message: 'Failed to process authenticated user' });
      }
    })(req, res, next);
  } catch (err) {
    console.error('OAuth callback error:', err?.stack || err);
    return res.status(500).json({ success: false, message: 'OAuth callback error' });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // return public view including email because requester is the owner (authenticated)
    res.json({
      success: true,
      user: user.toPublic(true)
    });
  } catch (error) {
    console.error('Get profile error:', error?.stack || error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
};

// Logout (invalidate tokens for this user by bumping tokenVersion)
export const logout = async (req, res) => {
  try {
    // increment tokenVersion to revoke all existing tokens for this user
    await User.incrementTokenVersion(req.user.userId);
    // clear token cookie if used
    if (process.env.SEND_TOKEN_COOKIE === 'true') {
      res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    }
    return res.json({
      success: true,
      message: 'Logout successful. Tokens invalidated on server.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Failed to logout' });
  }
};

// Refresh token: ensure tokenVersion still matches before issuing new token matches before issuing new token
export const refreshToken = async (req, res) => {const refreshToken = async (req, res) => {
  try {ry {
    const user = await User.findById(req.user.userId).select('-__v');  const user = await User.findById(req.user.userId).select('-__v');
    if (!user) {    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });not found' });
    }
    // issue new JWT reflecting current tokenVersionissue new JWT reflecting current tokenVersion
    const token = generateToken(user);
    res.json({ success: true, message: 'Token refreshed successfully', token });d successfully', token });
  } catch (error) {
    console.error('Refresh token error:', error?.stack || error);ack || error);
    return res.status(500).json({ success: false, message: 'Failed to refresh token' });
  }
};
