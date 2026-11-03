import config from '@lxsmnsyc/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [config],
  // Agent worktrees under .claude/ hold other branches' work in progress.
  ignorePatterns: ['dist/**', 'benchmarks/**', '.claude/**'],
});
