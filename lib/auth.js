function getSecret() {
  return process.env.AUTH_SECRET || 'dev-only-insecure-secret-change-me';
}

function base64url(bytes) {
  let binary = '';
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBytes(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function strToBytes(str) {
  return new TextEncoder().encode(str);
}

function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getHmacKey() {
  return crypto.subtle.importKey('raw', strToBytes(getSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function createSessionToken() {
  const payload = {
    ok: true,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000
  };
  const payloadStr = base64url(strToBytes(JSON.stringify(payload)));
  const key = await getHmacKey();
  const signatureBytes = await crypto.subtle.sign('HMAC', key, strToBytes(payloadStr));
  const signature = bytesToHex(signatureBytes);
  return payloadStr + '.' + signature;
}

export async function verifySessionToken(token) {
  if (!token || !token.includes('.')) return false;
  const [payloadStr, signature] = token.split('.');
  if (!payloadStr || !signature) return false;

  try {
    const key = await getHmacKey();
    const expectedBytes = await crypto.subtle.sign('HMAC', key, strToBytes(payloadStr));
    const expectedSignature = bytesToHex(expectedBytes);
    if (signature !== expectedSignature) return false;

    const payloadBytes = base64urlToBytes(payloadStr);
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (!payload.exp || payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_NAME = 'biz_dashboard_session';
