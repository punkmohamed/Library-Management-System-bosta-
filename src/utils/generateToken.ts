import jwt from 'jsonwebtoken';


export const generateEmailVerificationToken = (userId: string, email: string) => {
  const payload = {
    userId,
    email,
    type: 'email_verification',
  }
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }
  const verificationToken = jwt.sign(payload, secret, { expiresIn: '24h' })
  return verificationToken
}
export const verifyEmailVerificationToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    if (decoded.type !== 'email_verification') {
      throw new Error('Invalid token type');
    }
    return decoded
  } catch (error) {
    console.error('Error verifying email verification token:', error);
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Verification token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid verification token');
    } else {
      throw error;
    }
  }
}

export const generateAccountDeletionToken = (userId: string, email: string) => {
  const payload = {
    userId,
    email,
    type: 'account_deletion',
  }
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }
  const verificationToken = jwt.sign(payload, secret, { expiresIn: '24h' })
  return verificationToken
}
export const verifyAccountDeletionToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    if (decoded.type !== 'account_deletion') {
      throw new Error('Invalid token type');
    }
    return decoded
  } catch (error) {
    console.error('Error verifying account deletion token:', error);
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Account deletion token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid account deletion token');
    } else {
      throw error;
    }
  }
}
