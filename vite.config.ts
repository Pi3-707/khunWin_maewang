import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Windows missed file changes made by tools that replace the file (sed -i), so poll instead of relying on events.
  server: { watch: { usePolling: true, interval: 300 } },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
