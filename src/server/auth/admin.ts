import crypto from "crypto";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || process.env.ADMIN_SECRET || "";
}

function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

export function isValidAdminSecret(providedSecret?: string | null): boolean {
  const configured = getAdminSecret();
  if (!providedSecret || !configured) return false;
  const raw = providedSecret.trim();
  const decoded = safeDecode(raw).trim();

  // Accept configured secret, decoded or encoded variant
  const accepted = [
    configured,
    safeDecode(configured),
    encodeURIComponent(configured),
  ];

  return accepted.some((candidate) => {
    const candHash = crypto.createHash("sha256").update(candidate).digest();
    const rawHash = crypto.createHash("sha256").update(raw).digest();
    const decHash = crypto.createHash("sha256").update(decoded).digest();
    return (
      crypto.timingSafeEqual(candHash, rawHash) ||
      crypto.timingSafeEqual(candHash, decHash)
    );
  });
}

/**
 * Constant-time password validation using SHA-256 hashes to prevent length-leak timing attacks
 */
export function isValidAdminPassword(providedPassword?: string | null): boolean {
  const actual = getAdminPassword();
  if (!providedPassword || !actual) return false;
  const providedHash = crypto.createHash("sha256").update(providedPassword).digest();
  const actualHash = crypto.createHash("sha256").update(actual).digest();
  return crypto.timingSafeEqual(providedHash, actualHash);
}

export function createAdminSessionToken(): string {
  const password = getAdminPassword();
  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable is not configured");
  }
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const data = `admin_session_${expiresAt}`;
  const signature = crypto.createHmac("sha256", password).update(data).digest("hex");
  return `${expiresAt}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expiresAtStr, signature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  const password = getAdminPassword();
  if (!password) return false;
  const data = `admin_session_${expiresAt}`;
  const expectedSignature = crypto.createHmac("sha256", password).update(data).digest("hex");

  const sigBuffer = Buffer.from(signature, "hex");
  const expBuffer = Buffer.from(expectedSignature, "hex");

  if (sigBuffer.length !== expBuffer.length || sigBuffer.length === 0) return false;
  return crypto.timingSafeEqual(sigBuffer, expBuffer);
}

export function isRequestAuthorized(request: { cookies: { get: (name: string) => { value: string } | undefined } }): boolean {
  const token = request.cookies.get("mytipe_admin_session")?.value;
  return verifyAdminSessionToken(token);
}
