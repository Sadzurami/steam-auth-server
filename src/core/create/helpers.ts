import { createHash } from 'crypto';
import { hostname } from 'os';

// https://github.com/DoctorMcKay/node-steam-session/issues/44
export function createMachineName(accountName?: string): string {
  const hash = createHash('sha1');
  hash.update(accountName || hostname());

  const sha1 = hash.digest();
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let output = 'DESKTOP-';
  for (let i = 0; i < 7; i++) output += CHARS[sha1[i] % CHARS.length];

  return output;
}
