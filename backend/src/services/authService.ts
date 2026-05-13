import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";
import { conflict, unauthorized } from "../utils/errors";
import { prisma } from "../utils/prisma";

const TOKEN_EXPIRES_IN = "7d";

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return user;
}

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: TOKEN_EXPIRES_IN });
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const email = input.email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw conflict("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return { user: sanitizeUser(user), token: signToken(user.id) };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase().trim() }
  });

  if (!user) {
    throw unauthorized("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw unauthorized("Invalid email or password.");
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;
  return { user: sanitizeUser(safeUser), token: signToken(user.id) };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw unauthorized("Invalid or expired token.");
  }

  return sanitizeUser(user);
}
