import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';


export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePasswordStrength(password: string) {
  const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]{8,}$/;
  return passwordStrengthRegex.test(password);
}


const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_VERIFY_SECRET = process.env.JWT_VERIFY_SECRET!;
const API_URL = process.env.API_URL!;

export function verifyToken(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    (req as any).user = decoded;
    next();
  });
}

export async function refreshTokenHandler(req: NextApiRequest, res: NextApiResponse) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

    const newAccessToken = jwt.sign(
      { userId: payload.userId, type: payload.type },
      JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
}

export async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Secure; Path=/; Max-Age=2592000`);
  return res.status(200).json({ accessToken });
}

export function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', `refreshToken=; HttpOnly; Secure; Path=/; Max-Age=0`);
  return res.status(200).json({ message: 'Logged out' });
}

function generateTokens(user: any) {
  const accessTokenExpiry = '1h';
  const refreshTokenExpiry = '30d';

  const accessToken = jwt.sign(
    { userId: user.id, type: user.type },
    JWT_ACCESS_SECRET,
    { expiresIn: accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
}

export async function registerHandler(req: NextApiRequest, res: NextApiResponse) {
  const { username, email, password } = req.body;

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (!validatePasswordStrength(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and contain a number.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  const verificationToken = jwt.sign(
    { email },
    JWT_VERIFY_SECRET,
    { expiresIn: '1h' }
  );

  await supabase
    .from('users')
    .insert([{ username, email, password: hashedPassword, is_verified: false, verif_token: verificationToken }]);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'EtaFit HQ',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${API_URL}/verify-email?token=${verificationToken}">here</a> to verify your email.</p>`,
  };

  transporter.sendMail(mailOptions);

  return res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });
}