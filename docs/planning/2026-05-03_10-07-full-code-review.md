# Full Code Review — Dependency Cruiser

_Generated 2026-05-03 by Senior Staff+ Architect review_

## Pareto Analysis

### The 1% that delivers 51% of the result

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Fix Node 24 compatibility (119 test failures) | Critical — unblocks all development | 4h |
| 2 | Migrate ESLint to flat config | Critical — lint currently broken | 2h |
| 3 | Fix TypeScript moduleResolution deprecation | High — TS 7 will break types | 30min |

### The 4% that delivers 64% of the result

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 4 | Migrate sync I/O to async in extract/ | High — scalability for large codebases | 8h |
| 5 | Consolidate graph-utl/ (4 consolidate modules → 1) | Medium — reduces confusion | 3h |
| 6 | Abstract parser selection into registry pattern | Medium — extensibility | 3h |
| 7 | Fix package.json semver override | Low — npm 11 compat | 5min |

### The 20% that delivers 80% of the result

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 8 | Add middleware hooks to pipeline | Medium — composability | 4h |
| 9 | Consolidate enrich/derive/ into shared interface | Medium — testability | 3h |
| 10 | Cache RegExp compilation in hot path | Medium — performance | 1h |
| 11 | Add `any` type elimination in validate/ | Medium — type safety | 2h |
| 12 | Consolidate reporters by category | Low — maintainability | 4h |
| 13 | Reduce lodash dependency | Low — bundle size, native alternatives | 6h |
| 14 | Add graph transformation API | Low — programmatic use | 4h |
| 15 | Implement streaming for large graphs | Medium — memory efficiency | 8h |
| 16 | Add parallelism to file extraction | Medium — performance | 4h |
| 17 | Better Svelte 4+ support | Low — ecosystem alignment | 4h |
| 18 | Implement folder-scope via/viaNot | Low — feature completeness | 4h |
| 19 | Add Babel per-extension scoping | Low — flexibility | 3h |
| 20 | Implement AMD require.config support | Low — AMD completeness | 8h |

## Comprehensive File Review

### Critical Path Files (Highest Risk)

#### `src/extract/get-dependencies.mjs` (148 LOC)
**Assessment: GOOD — but could be deeper**

The file correctly dispatches to parser-specific extractors based on file type and options. However:
- Line 150-156: `matchesDoNotFollow` creates RegExp inline — should be pre-compiled
- Line 182-184: `matchesPattern` creates RegExp per call — hot path performance issue
- The parser dispatch logic (lines 120-140) should be extracted into a parser registry

#### `src/extract/index.mjs` (100 LOC)
**Assessment: GOOD — clean recursive extraction**

The `extractRecursive` function is clear and correct. Minor issues:
- Line 62: `lVisited = new Set()` should be `const`
- The `complete` function (line 109-118) does double filtering — could be simplified

#### `src/main/cruise.mjs` (96 LOC)
**Assessment: EXCELLENT — clean orchestration**

Well-structured pipeline with clear progress reporting via bus. Dynamic imports for heavy modules are good. The 10-step progress tracking is useful.

#### `src/validate/index.mjs` (110 LOC)
**Assessment: GOOD — but typed as `any`**

The validation engine is clean with proper separation of allowed/forbidden/required rules. However:
- Parameters typed as `*` (any) — loses type safety
- Line 39: Mutates `pRuleSet.forbidden` with `||` default — should use nullish coalescing
- The `matchModuleRule`, `matchDependencyRule`, `matchFolderRule` imports are the only coupling point — good seam

#### `src/main/options/normalize.mjs` (107 LOC)
**Assessment: CONCERNING — god-function pattern**

This is the most complex normalization file. It:
- Handles 15+ different option normalizations
- Has 3 TODOs (lines 93, 158, 191)
- Knows about defaults from CLI, rule sets, and its own constants
- Mixes concerns: validation, normalization, and default-setting

**Recommendation**: Split into focused normalizers per option group.

#### `src/report/index.mjs` (60 LOC)
**Assessment: EXCELLENT — clean reporter registry**

The `TYPE2MODULE` map is a clean registry pattern. Plugin support via `plugin:` prefix is elegant. The fallback to `identity.mjs` is graceful.

#### `src/enrich/enrich-modules.mjs` (39 LOC)
**Assessment: GOOD — clear enrichment pipeline**

Sequential enrichment steps with bus progress reporting. Each step is independently testable.

#### `src/graph-utl/indexed-module-graph.mjs` (179 LOC)
**Assessment: GOOD — efficient graph data structure**

Map-based indexing is correct. The `findTransitiveDependents` method handles cycles via visited set.

#### `src/cache/cache.mjs` (31 LOC)
**Assessment: EXCELLENT — clean strategy pattern**

Delegates to strategy-specific read/write. Very thin and deep.

### File Quality Distribution

| Quality | Count | Files |
|---------|-------|-------|
| Excellent | ~20 | cruise.mjs, report/index.mjs, cache.mjs, bus.mjs, format.mjs |
| Good | ~80 | Most source files |
| Concerning | ~15 | options/normalize.mjs, normalize-cli-options.mjs, get-dependencies.mjs (perf) |
| Technical debt | ~5 | .eslintrc.js (needs flat config), types/tsconfig.json |

## Detailed Task Breakdown (15min each, 27 tasks)

| # | Task | File(s) | Category |
|---|------|---------|----------|
| 1 | Fix semver override in package.json | package.json:217-222 | Compat |
| 2 | Fix `R_OK` imports for Node 24 | 4 files | Compat |
| 3 | Fix symlink-dir ESM import | 2 test files | Compat |
| 4 | Create eslint.config.js (flat config) | New file | Tooling |
| 5 | Update types/tsconfig.json moduleResolution | types/tsconfig.json | Tooling |
| 6 | Run prettier on 3 files | 3 files | Style |
| 7 | Pre-compile regex in get-dependencies.mjs | src/extract/get-dependencies.mjs | Perf |
| 8 | Pre-compile regex in matchesPattern | src/extract/get-dependencies.mjs:182 | Perf |
| 9 | Extract parser registry from get-dependencies.mjs | src/extract/get-dependencies.mjs | Arch |
| 10 | Consolidate consolidate-to-* modules | src/graph-utl/consolidate-*.mjs | Arch |
| 11 | Fix `let lVisited` to `const` in extract/index.mjs | src/extract/index.mjs:62 | Code |
| 12 | Replace `pRuleSet.forbidden || []` with `??` | src/validate/index.mjs:39 | Code |
| 13 | Add type annotations to validate/index.mjs | src/validate/index.mjs | Types |
| 14 | Split options/normalize.mjs into focused normalizers | src/main/options/normalize.mjs | Arch |
| 15 | Extract common enrichment interface | src/enrich/derive/ | Arch |
| 16 | Implement TODO: apply filters to folders | src/main/report-wrap.mjs:34 | Feature |
| 17 | Implement TODO: centralize default constants | src/main/options/normalize.mjs:158 | Code |
| 18 | Implement TODO: normalize doNotFollow/exclude uniformly | src/main/options/normalize.mjs:191 | Arch |
| 19 | Add validation in extract-known-violations | src/config-utl/extract-known-violations.mjs:19 | Feature |
| 20 | Implement folder-scope via's | src/validate/match-folder-dependency-rule.mjs:39 | Feature |
| 21 | Create NormalizedFromRestriction type | src/utl/regex-util.mjs:20 | Types |
| 22 | Use text-table in metrics reporter | src/report/metrics.mjs:81 | Code |
| 23 | Clarify metrics rule philosophy | src/main/options/normalize.mjs:93 | Code |
| 24 | Add {tj}sx support to SWC parser | src/extract/parse/to-swc-ast.mjs:17 | Feature |
| 25 | Enable progress in summarize-options | src/enrich/summarize/summarize-options.mjs:32 | Code |
| 26 | Improve merge-configs implementation | src/config-utl/extract-depcruise-config/merge-configs.mjs:75 | Code |
| 27 | Handle gitignored files in cache content changes | src/cache/find-content-changes.mjs:59 | Feature |

## Split Brain Check

**No split brains detected.** Type definitions are centralized in `types/`. Schema definitions are generated from `tools/schema/`. No duplicate type definitions found.

## Security Assessment

- ✅ No hardcoded secrets
- ✅ Uses `safe-regex` to validate rule patterns
- ⚠️ `security/detect-non-literal-fs-filename` rule disabled in .eslintrc.js — many dynamic file paths
- ✅ No SQL, no network calls in core (only local filesystem)
- ✅ Plugin system loads from node_modules — standard npm security model
