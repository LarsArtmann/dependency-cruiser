# Architecture Review — Dependency Cruiser

_Generated 2026-05-03_

## 1. Architecture Overview

Dependency Cruiser follows a **pipeline architecture** with four distinct stages:

```
CLI → Options Normalization → Extraction → Enrichment → Reporting
```

The data flows as an `ICruiseResult` (JSON-serializable) through the pipeline, transformed at each stage.

### Module Structure (14 top-level modules)

| Module | Responsibility | LOC | Depth |
|--------|---------------|-----|-------|
| `src/main/` | Orchestration: cruise, format, options normalization | ~350 | **Deep** — high leverage interface |
| `src/extract/` | AST parsing, dependency extraction, module resolution | ~650 | **Deep** — complex logic behind focused interfaces |
| `src/enrich/` | Cycle detection, validation, metrics, orphans, dependents | ~430 | **Medium** — well-factored but some coupling |
| `src/validate/` | Rule matching (forbidden/allowed/required) | ~180 | **Deep** — regex rule engine |
| `src/report/` | 19 output format reporters | ~950 | **Shallow** — many thin adapters |
| `src/cli/` | CLI entry, option parsing, init-config | ~500 | **Medium** — some complex option normalization |
| `src/cache/` | Metadata and content-based caching | ~380 | **Deep** — two strategies behind unified interface |
| `src/graph-utl/` | Graph operations: focus, filter, consolidate, compare | ~350 | **Medium** — utility-focused |
| `src/config-utl/` | Config file extraction (babel, ts, webpack, depcruise) | ~170 | **Shallow** — mostly thin wrappers |
| `src/schema/` | JSON schemas for configuration and results | Generated | **Deep** — single source of truth |
| `src/utl/` | Shared utilities (bus, regex, path) | ~170 | **Appropriate** |
| `types/` | TypeScript type definitions | ~40 files | **Deep** — strong type safety boundary |

## 2. Scalability Assessment

### Strengths
- **Plugin architecture for reporters**: External reporters via `plugin:` prefix
- **Strategy pattern for caching**: Two strategies (metadata/content) behind unified `Cache` class
- **Event bus (pub/sub)**: Decoupled progress reporting via `bus` EventEmitter
- **Lazy loading**: Dynamic `import()` for heavy modules (transpilers, cache) only when needed
- **Separation of extraction and enrichment**: Clean pipeline allows independent evolution

### Weaknesses
- **Synchronous file I/O**: `readFileSync`, `readdirSync`, `accessSync`, `statSync` throughout extraction — blocks event loop on large codebases
- **No streaming**: Entire dependency graph held in memory before reporting
- **Regex compilation in hot path**: `RegExp(pPattern, "g").test()` in `get-dependencies.mjs:182` creates new RegExp per call
- **Recursive extraction**: `extractRecursive` in `extract/index.mjs` uses stack recursion — could overflow on very deep dependency trees
- **No parallelism**: Files processed sequentially despite being independent

## 3. Modularity Assessment

### Good Boundaries (Deep Modules)
- **`extract/index.mjs`**: Clean extraction pipeline behind `extract()` function
- **`validate/index.mjs`**: Validation engine with `.module()`, `.dependency()`, `.folder()` interface
- **`report/index.mjs`**: Reporter registry with `getReporter()` factory
- **`cache/cache.mjs`**: Unified cache interface hiding strategy details
- **`graph-utl/indexed-module-graph.mjs`**: Efficient graph lookup structure

### Shallow Modules (Candidates for Consolidation)
- **`config-utl/`**: Thin wrappers — `extract-babel-config.mjs`, `extract-ts-config.mjs`, `extract-webpack-resolve-config.mjs` each do one simple thing
- **`report/*.mjs`**: 19 reporter files, many <50 lines — could be consolidated by category
- **`enrich/derive/`**: Many small files (orphan, dependents, circular, reachable, metrics, folders) with no shared interface
- **`graph-utl/`**: 11 utility files with overlapping responsibilities (consolidate-modules, consolidate-to-folder, consolidate-to-pattern, consolidate-module-dependencies)

## 4. Composability Assessment

### Well-Composed
- `cruise()` API accepts options, resolve options, and transpile options separately
- Reporters are independently selectable via `outputType`
- Filters (includeOnly, exclude, focus, reaches, highlight) compose freely
- Config `extends` allows rule set inheritance and merging

### Composition Gaps
- **No middleware/hooks**: No way to intercept/transform results between pipeline stages
- **Fixed pipeline order**: Extract → Enrich → Report order is hardcoded in `cruise.mjs`
- **Reporter options coupled to config**: Reporter-specific options buried in `ruleSet.options.reporterOptions` — awkward for API usage
- **No graph transformation API**: Cannot programmatically transform the dependency graph between extraction and reporting

## 5. Coupling Analysis

### Tight Coupling Concerns
1. **`lodash` everywhere**: 27 files import lodash — deep dependency on utility library
2. **`options/normalize.mjs` knows everything**: 107 lines, imports from 6 different modules — god-function pattern
3. **`get-dependencies.mjs` coupled to all parsers**: Imports all AST extractors and parsers directly
4. **`report-wrap.mjs` couples enrich and report**: Imports from both `enrich/summarize` and `graph-utl`

### Loose Coupling Wins
1. **Event bus** decouples CLI feedback from core logic
2. **Reporter registry** decouples output format from business logic
3. **Dynamic imports** for transpilers (babel, svelte, typescript) — loaded only when needed
4. **JSON schema** defines the contract between stages

## 6. Type Safety Assessment

### Strengths
- Comprehensive TypeScript type definitions in `types/` directory
- JSDoc `@type` annotations throughout source code
- JSON schema validation for configuration and results
- `d.ts` files for public API surface

### Weaknesses
- Source is JavaScript (.mjs), not TypeScript — type annotations are advisory only
- Many `any` types in JSDoc (e.g., `validate/index.mjs` uses `*` for pRuleSet, pFrom, pTo)
- No runtime type validation (relies on JSON schema for config, but not for internal data flow)

## 7. Recommendations (Priority Order)

### High Impact
1. **Migrate to async file I/O**: Replace `readFileSync`/`readdirSync` with async counterparts — largest scalability bottleneck
2. **Consolidate `graph-utl/`**: 4 consolidation modules share patterns — extract shared interface
3. **Fix Node 24 / ESLint 10 / TypeScript 6 compatibility**: Blocking current development

### Medium Impact
4. **Add middleware hooks to pipeline**: Allow custom transformations between stages
5. **Consolidate `enrich/derive/`**: Many small files could share a common enrichment interface
6. **Parser strategy pattern**: Abstract parser selection from `get-dependencies.mjs` into a strategy registry
7. **Cache RegExp compilation**: Pre-compile patterns during option normalization

### Lower Impact
8. **Consolidate reporters by category**: Group related reporters (dot variants, error variants)
9. **Reduce lodash dependency**: Many uses are trivial (has, clone, set, get) replaceable with native JS
10. **Add graph transformation API**: Enable programmatic graph manipulation
