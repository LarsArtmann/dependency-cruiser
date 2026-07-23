# Code Quality Scan — Dependency Cruiser

_Generated 2026-05-03_

## Build Status

| Step | Status | Notes |
|------|--------|-------|
| `make build` | ✅ PASS | Generates schemas + meta.js |
| `npm run lint:eslint` | ❌ FAIL | ESLint 10 requires flat config (eslint.config.js); project uses `.eslintrc.js` |
| `npm run format:check` | ⚠️ WARN | 3 files need formatting |
| `npm run lint:types` | ❌ FAIL | TypeScript deprecation: `moduleResolution=node10` deprecated in TS 6 |
| `npm test` | ⚠️ PARTIAL | 1361 passing, 119 failing (Node 24 compatibility issues) |

## Node 24 Compatibility Issues (CRITICAL)

### Fixed in this scan
1. **`R_OK` removed from `node:fs` named exports** — Fixed in 4 files:
   - `src/cli/init-config/environment-helpers.mjs`
   - `src/cli/normalize-cli-options.mjs`
   - `src/cli/utl/validate-file-existence.mjs`
   - `src/extract/resolve/resolve-amd.mjs`

2. **`symlink-dir` ESM default export** — Fixed in 2 test files:
   - `test/extract/get-dependencies.amd.spec.mjs`
   - `test/extract/get-dependencies.cjs.spec.mjs`

### Remaining (119 test failures)
3. **`TypeError: Cannot read properties of undefined (reading 'Latest')`** — ~30+ failures in report tests. Likely related to chalk or figures ESM changes in Node 24.
4. **`AssertionError: Missing expected exception`** — ~6 failures. Exception handling behavior changes.
5. **`AssertionError: Expected values to be strictly deep-equal`** — ~80+ failures. Test fixture mismatches, likely from TypeScript 6 or Node 24 behavior changes.

## ESLint Configuration Issue

Project uses `.eslintrc.js` (RC format) which is removed in ESLint 10. The `eslint` devDependency is `10.2.1`. The project needs to migrate to flat config (`eslint.config.js`).

## Prettier Issues

3 files need formatting:
- `types/strict-restrictions.d.ts`
- `types/strict-rule-set.d.ts`
- `test/report/plugins/index.is-valid-plugin.spec.mjs`

## TypeScript Configuration Issue

`types/tsconfig.json` uses `moduleResolution: "node10"` which is deprecated in TypeScript 6.0.3 (installed) and will be removed in TypeScript 7.0.

## Source Code TODOs (13 items)

| Priority | File | Line | TODO |
|----------|------|------|------|
| Medium | `src/main/report-wrap.mjs` | 34 | Apply filters to the folders too |
| Medium | `src/main/options/normalize.mjs` | 191 | Treat doNotFollow/exclude same as other filters |
| Medium | `src/main/options/normalize.mjs` | 158 | Centralize default values as constants |
| Medium | `src/config-utl/extract-known-violations.mjs` | 19 | Validate JSON against schema |
| Medium | `src/validate/rule-classifiers.mjs` | 21 | Simplify scope normalization |
| Low | `src/validate/match-folder-dependency-rule.mjs` | 39 | Implement folder via's |
| Low | `src/utl/regex-util.mjs` | 20 | Separate type for NormalizedFromRestriction |
| Low | `src/report/metrics.mjs` | 81 | Use table module (text-table) |
| Low | `src/main/options/normalize.mjs` | 93 | Clarify metrics rule philosophy |
| Low | `src/extract/parse/to-swc-ast.mjs` | 17 | Add {tj}sx support |
| Low | `src/enrich/summarize/summarize-options.mjs` | 32 | Enable "progress" in options summary |
| Low | `src/config-utl/extract-depcruise-config/merge-configs.mjs` | 75 | Less naive merge implementation |
| Low | `src/cache/find-content-changes.mjs` | 59 | Handle gitignored files in deletion detection |

## Test Coverage Gaps (37 c8 ignore directives)

| Area | Count | Key files |
|------|-------|-----------|
| SWC AST extractor | 7 | `swc-dependency-visitor.mjs` — many edge cases untested |
| CLI init-config | 3 | Error paths in config generation |
| Transpilers | 2 | CoffeeScript/LiveScript error paths |
| TypeScript deps | 2 | Edge cases in TS dependency extraction |
| CLI main | 2 | Global install warning, error handling |
| Others | 21 | Various error paths across codebase |

## Codebase Metrics

| Metric | Value |
|--------|-------|
| Source files | 176 |
| Test files | 186 |
| Test cases | 1,480 |
| Estimated source LOC | ~4,100 |
| Direct dependencies | 27 |
| Dev dependencies | 33 |

## Priority Actions

1. **Node 24 compatibility** — Fix remaining 119 test failures (chalk/figures ESM, TS6 behavior)
2. **ESLint flat config migration** — Required for ESLint 10+
3. **TypeScript moduleResolution migration** — Required before TS 7
4. **Package.json overrides fix** — `semver` override should match direct dependency version
