// Builds the SpeekZone web app (repo root) so the API server can serve it from dist/.
// Runs as server postinstall on Render only; local `npm install` in /server skips it.
const { execSync } = require('child_process');
const path = require('path');

if (!process.env.RENDER && !process.env.BUILD_WEB) {
  console.log('[build-web] skipped (not on Render; set BUILD_WEB=1 to force)');
  process.exit(0);
}

const root = path.resolve(__dirname, '..');
// Web build talks to the API on its own origin (Render sets RENDER_EXTERNAL_URL).
const apiUrl = process.env.WEB_API_URL || process.env.RENDER_EXTERNAL_URL || 'https://speekzone.onrender.com';
const run = (cmd, extra = {}) =>
  execSync(cmd, { cwd: root, stdio: 'inherit', env: { ...process.env, ...extra } });

run('npm install --include=dev --no-audit --no-fund', { NODE_ENV: 'development' });
run('npx tsc', { NODE_ENV: 'production' });
run('npx vite build', { NODE_ENV: 'production', VITE_API_URL: apiUrl });
console.log('[build-web] API URL baked in:', apiUrl);
console.log('[build-web] web app built to', path.join(root, 'dist'));
