import { build } from 'vite';

// Remove any yarn-added flags like --silent
const args = process.argv.slice(2).filter((a) => a !== '--silent');

try {
  await build();
  console.log('Vite build succeeded');
} catch (e) {
  console.error('Vite build failed', e);
  process.exit(1);
}
