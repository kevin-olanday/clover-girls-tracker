/**
 * Run once to create the three club accounts in Supabase Auth.
 * Requires SUPABASE_SERVICE_ROLE_KEY in your .env file.
 *
 * Usage:
 *   node scripts/create-users.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env manually — avoids needing the dotenv package
const envPath = resolve(__dirname, '../.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => line.split('=').map((p) => p.trim()))
    .filter(([k]) => k)
    .map(([k, ...rest]) => [k, rest.join('=').replace(/^["']|["']$/g, '')])
);

const url = env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    'Missing env vars. Add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env file.'
  );
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEFAULT_PASSWORD = 'lucky123';
const EMAIL_DOMAIN = 'luckygirls.app';

const users = [
  { name: 'Admin', email: `admin@${EMAIL_DOMAIN}` },
  { name: 'Jann', email: `jann@${EMAIL_DOMAIN}` },
  { name: 'Jenn', email: `jenn@${EMAIL_DOMAIN}` },
  { name: 'Jena', email: `jena@${EMAIL_DOMAIN}` },
];

console.log('Creating club accounts…\n');

for (const user of users) {
  const { data, error } = await admin.auth.admin.createUser({
    email: user.email,
    password: DEFAULT_PASSWORD,
    email_confirm: true,          // skip confirmation email
    user_metadata: {
      name: user.name,
      force_password_change: true, // prompt to set own password on first login
    },
  });

  if (error) {
    console.error(`✗ ${user.name} (${user.email}): ${error.message}`);
  } else {
    console.log(`✓ ${user.name} — ${user.email} — id: ${data.user.id}`);
  }
}

console.log(`\nDone. Default password: "${DEFAULT_PASSWORD}"`);
console.log('Each user will be prompted to set a new password on their first login.');
