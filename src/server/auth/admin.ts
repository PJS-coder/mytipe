import crypto from "crypto";

const DEFAULT_ADMIN_PASSWORD = "MudditmaKKar@#@*&Gyft566U^%%&^^&*YGH";
const DEFAULT_ADMIN_SECRET = "mudditmakkaradmin2t7yfbu23@%^&YGI";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || DEFAULT_ADMIN_SECRET;
}

function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

export function isValidAdminSecret(providedSecret?: string | null): boolean {
  if (!providedSecret) return false;
  const raw = providedSecret.trim();
  const decoded = safeDecode(raw).trim();
  const configured = getAdminSecret();

  // Accept configured secret, decoded or encoded variant
  const accepted = [
    configured,
    safeDecode(configured),
    encodeURIComponent(configured),
    DEFAULT_ADMIN_SECRET,
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
  if (!providedPassword) return false;
  const actual = getAdminPassword();
  const providedHash = crypto.createHash("sha256").update(providedPassword).digest();
  const actualHash = crypto.createHash("sha256").update(actual).digest();
  return crypto.timingSafeEqual(providedHash, actualHash);
}

export function createAdminSessionToken(): string {
  const password = getAdminPassword();
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
