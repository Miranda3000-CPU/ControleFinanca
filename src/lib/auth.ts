import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "controle_financas_session";
const SESSION_DURATION_DAYS = 30;
const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_DAYS * 24 * 60 * 60;

type SessionPayload = JWTPayload & {
  sub: string;
  userName: string;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET não definido no ambiente.");
  }

  return new TextEncoder().encode(secret);
}

export function getAdminCredentials() {
  return {
    userName: process.env.ADMIN_USER ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "12345678",
  };
}

async function signSessionToken(userName: string) {
  return new SignJWT({ userName })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("personal-admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(getSessionSecret());
}

async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });

    if (
      !payload.sub ||
      typeof payload.sub !== "string" ||
      !payload.userName ||
      typeof payload.userName !== "string"
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userName: string) {
  const token = await signSessionToken(userName);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);

  if (!payload?.userName) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return {
    userName: payload.userName,
  };
}
