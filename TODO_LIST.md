# TODO List — Dependency Cruiser

_Auto-generated 2026-05-03 from comprehensive codebase audit_

## Files Read

- [x] `package.json` — dependencies, scripts, engine constraints
- [x] `README.md` — project overview, installation, usage
- [x] `CHANGELOG.md` — recent changes (v13.1.5)
- [x] `CONTRIBUTING.md` — contribution guidelines
- [x] `SECURITY.md` — security policy
- [x] `doc/cli.md` — CLI options and features
- [x] `doc/api.md` — API surface
- [x] `doc/options-reference.md` — configuration options
- [x] `doc/rules-reference.md` — rule types and conditions
- [x] `doc/faq.md` — capabilities and roadmap references
- [x] `doc/output-format.md` — output formats
- [x] `.eslintrc.js` — lint configuration
- [x] `.dependency-cruiser.json` — self-validation config
- [x] All source files in `src/` — 176 files
- [x] All test files in `test/` — 186 files

---

## 🔴 Critical — Blocks Development

### NODE-24 COMPAT — 119 test failures

| # | Task | File(s) | Status | Effort |
|---|------|---------|--------|--------|
| 1 | Fix `R_OK` removed from `node:fs` named exports | `src/cli/init-config/environment-helpers.mjs`, `src/cli/normalize-cli-options.mjs`, `src/cli/utl/validate-file-existence.mjs`, `src/extract/resolve/resolve-amd.mjs` | ✅ Done | Done |
| 2 | Fix `symlink-dir` ESM default export | `test/extract/get-dependencies.amd.spec.mjs`, `test/extract/get-dependencies.cjs.spec.mjs` | ✅ Done | Done |
| 3 | Fix `chalk`/`figures` ESM `Cannot read 'Latest'` errors (~30 tests) | Report test files | ❌ Not started | 2h |
| 4 | Fix exception handling behavior changes (~6 tests) | Various test files | ❌ Not started | 1h |
| 5 | Fix test fixture mismatches from TS6/Node 24 (~80 tests) | Test fixtures, snapshots | ❌ Not started | 4h |

### TOOLING — Broken lint pipeline

| # | Task | File(s) | Status | Effort |
|---|------|---------|--------|--------|
| 6 | Migrate ESLint to flat config (`eslint.config.js`) | `.eslintrc.js` → new file | ❌ Not started | 2h |
| 7 | Fix TypeScript `moduleResolution: "node10"` deprecation | `types/tsconfig.json` | ❌ Not started | 30min |
| 8 | Fix `semver` override in package.json (npm 11 compat) | `package.json:217-222` | ✅ Done | Done |

---

## 🟡 High Priority — Source Code TODOs

| # | Task | File | Line | Status | Effort |
|---|------|------|------|--------|--------|
| 9 | Apply filters to folders in report-wrap | `src/main/report-wrap.mjs` | 34 | ❌ Not started | 2h |
| 10 | Treat `doNotFollow`/`exclude` uniformly as filters | `src/main/options/normalize.mjs` | 191 | ❌ Not started | 3h |
| 11 | Centralize default values as constants (not in CLI defaults) | `src/main/options/normalize.mjs` | 158 | ❌ Not started | 1h |
| 12 | Validate known violations JSON against schema | `src/config-utl/extract-known-violations.mjs` | 19 | ❌ Not started | 30min |
| 13 | Simplify scope normalization in rule-classifiers | `src/validate/rule-classifiers.mjs` | 21 | ❌ Not started | 30min |

---

## 🟠 Medium Priority — Architecture Improvements

| # | Task | Description | Status | Effort |
|---|------|-------------|--------|--------|
| 14 | Extract Parser Strategy Registry | Move parser dispatch from `get-dependencies.mjs` into registry pattern | ❌ Not started | 3h |
| 15 | Decompose options normalization | Split `normalize.mjs` into focused normalizers with compose pattern | ❌ Not started | 3h |
| 16 | Unify graph consolidation | Merge 4 `consolidate-*.mjs` modules into one deep module | ❌ Not started | 2h |
| 17 | Standardize enrichment pipeline | Create `(modules, options) => modules` enricher interface | ❌ Not started | 2h |
| 18 | Consolidate reporters by category | Group 19+ reporter files into category modules | ❌ Not started | 4h |
| 19 | Migrate sync I/O to async | Replace `readFileSync`/`readdirSync` with async in extraction pipeline | ❌ Not started | 8h |
| 20 | Cache RegExp compilation | Pre-compile patterns during option normalization | ❌ Not started | 1h |
| 21 | Add middleware hooks to pipeline | Allow custom transformations between pipeline stages | ❌ Not started | 4h |

---

## 🟢 Low Priority — Planned Features

| # | Task | Source | Status | Effort |
|---|------|--------|--------|--------|
| 22 | Implement folder-scope `via`/`viaOnly`/`viaSomeNot`/`viaNot` | rules-reference.md | ❌ Not started | 4h |
| 23 | Lift reachable rule `from`/`to` beyond path/pathNot | rules-reference.md | ❌ Not started | 4h |
| 24 | Add additional `exclude` attributes beyond `dynamic` | options-reference.md | ❌ Not started | 3h |
| 25 | Implement Babel per-extension scoping | options-reference.md | ❌ Not started | 3h |
| 26 | Support Babel config function exports | options-reference.md | ❌ Not started | 2h |
| 27 | Support `--ignore-known` for dot/html/teamcity reporters | cli.md | ❌ Not started | 2h |
| 28 | Better JSX import/export in fragments | faq.md | ❌ Not started | 4h |
| 29 | Implement AMD `require.config` support | resolve-amd.mjs comments | ❌ Not started | 8h |
| 30 | Add `{tj}sx` support to SWC parser | `src/extract/parse/to-swc-ast.mjs:17` | ❌ Not started | 2h |
| 31 | Better Svelte 4+ support (currently pinned to <4) | package.json upem policies | ❌ Not started | 4h |

---

## 🔵 Minor — Style & Cleanup

| # | Task | File | Status | Effort |
|---|------|------|--------|--------|
| 32 | Run prettier on 3 files | `types/strict-restrictions.d.ts`, `types/strict-rule-set.d.ts`, `test/report/plugins/index.is-valid-plugin.spec.mjs` | ❌ Not started | 5min |
| 33 | Fix `budapestian/global-constant-pattern` FIXME | `.eslintrc.js:13` | ❌ Not started | 30min |
| 34 | Create `NormalizedFromRestriction` type | `src/utl/regex-util.mjs:20` | ❌ Not started | 30min |
| 35 | Use text-table in metrics reporter | `src/report/metrics.mjs:81` | ❌ Not started | 30min |
| 36 | Clarify metrics rule philosophy | `src/main/options/normalize.mjs:93` | ❌ Not started | 15min |
| 37 | Enable "progress" in summarize-options | `src/enrich/summarize/summarize-options.mjs:32` | ❌ Not started | 15min |
| 38 | Improve merge-configs implementation | `src/config-utl/extract-depcruise-config/merge-configs.mjs:75` | ❌ Not started | 1h |
| 39 | Handle gitignored files in cache content changes | `src/cache/find-content-changes.mjs:59` | ❌ Not started | 1h |
| 40 | Add type annotations to validate/index.mjs | `src/validate/index.mjs` | ❌ Not started | 30min |
| 41 | Fix `let lVisited` to `const` in extract/index.mjs | `src/extract/index.mjs:62` | ❌ Not started | 5min |
| 42 | Replace `pRuleSet.forbidden \|\| []` with `??` | `src/validate/index.mjs:39` | ❌ Not started | 5min |

---

## Summary

| Category | Count | Total Effort |
|----------|-------|-------------|
| 🔴 Critical | 8 | ~10h (3 already done) |
| 🟡 High Priority | 5 | ~7h |
| 🟠 Architecture | 8 | ~27h |
| 🟢 Planned Features | 10 | ~36h |
| 🔵 Minor | 11 | ~4.5h |
| **Total** | **42** | **~84.5h** |
