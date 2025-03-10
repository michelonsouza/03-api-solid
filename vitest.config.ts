import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    workspace: [
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['./src/http/controllers/**/*.spec.ts'],
          environment: './prisma/setup-tests.ts',
        },
      },
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['./src/use-cases/**/*.spec.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        '.husky',
        'src/env',
        'prisma/setup-tests.ts',
      ],
    },
  },
});
