import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const compat = new FlatCompat({ baseDirectory: path.dirname(fileURLToPath(import.meta.url)), recommendedConfig: js.configs.recommended });
export default [{ ignores: ['dist/**', 'test-results/**', 'playwright-report/**'] }, ...compat.config(require('./.eslintrc.cjs'))];
