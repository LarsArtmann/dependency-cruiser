# Improve Codebase Architecture — Deepening Opportunities

_Generated 2026-05-03_

## Glossary

- **Module** — anything with an interface and an implementation
- **Depth** — leverage at the interface: high leverage = deep, interface ≈ implementation = shallow
- **Seam** — where an interface lives; a place behavior can be altered without editing in place
- **Adapter** — a concrete thing satisfying an interface at a seam

## Deepening Opportunities

### 1. Parser Strategy Registry

**Files**: `src/extract/get-dependencies.mjs`, `src/extract/parse/`, `src/extract/ast-extractors/`

**Problem**: `get-dependencies.mjs` contains a 30-line parser dispatch block (lines 18-140) with direct imports of all parsers and extractors. Adding a new parser requires modifying this file. The module is **shallow** — callers of `getDependencies` must know about parser selection logic.

**Solution**: Extract a `ParserRegistry` that maps parser name → { parse, extract } functions. `getDependencies` becomes:

```javascript
const parser = parserRegistry.get(options.parser, fileName);
const deps = parser.extract(parser.parse(fileName), options);
```

**Benefits**: 
- **Locality**: Parser addition requires changes in one place (registry)
- **Leverage**: `getDependencies` becomes a clean 3-step pipeline
- **Testability**: Each parser can be tested in isolation with a simple interface

---

### 2. Options Normalization Decomposition

**Files**: `src/main/options/normalize.mjs` (107 LOC)

**Problem**: Single function handles 15+ option normalizations including defaults, filters, reporter options, and collapse patterns. It's the **widest module** in the codebase — its interface (the options object) exposes every possible option. 3 TODOs indicate known friction.

**Solution**: Split into focused normalizer functions composed by a thin orchestrator:

```javascript
export function normalizeCruiseOptions(pOptions, pFiles) {
  return compose(
    normalizeDefaults,
    normalizeFilters,
    normalizeCollapse,
    normalizeModuleSystems,
    normalizeCache
  )(pOptions, pFiles);
}
```

**Benefits**:
- **Locality**: Change to filter normalization doesn't affect collapse normalization
- **Testability**: Each normalizer is independently testable
- **Leverage**: The compose function is the deep interface; individual normalizers are the implementation

---

### 3. Graph Consolidation Unification

**Files**: `src/graph-utl/consolidate-modules.mjs`, `src/graph-utl/consolidate-to-folder.mjs`, `src/graph-utl/consolidate-to-pattern.mjs`, `src/graph-utl/consolidate-module-dependencies.mjs`

**Problem**: Four modules with overlapping names and shared patterns. `consolidate-to-pattern` calls `consolidate-modules` which calls `consolidate-module-dependencies`. This is a **call chain disguised as modules** — each is shallow because it barely wraps the next.

**Solution**: Consolidate into a single `consolidate.mjs` with clear internal stages:

```javascript
export default function consolidate(modules, pattern) {
  // Stage 1: Group modules by pattern
  // Stage 2: Merge dependencies within groups  
  // Stage 3: Strip self-transitions
  return result;
}
```

**Benefits**:
- **Locality**: All consolidation logic in one place
- **Leverage**: Single function with deep behavior
- **Testability**: Test the consolidation contract, not the internal stages

---

### 4. Enrichment Pipeline Interface

**Files**: `src/enrich/derive/circular.mjs`, `src/enrich/derive/orphan/`, `src/enrich/derive/dependents/`, `src/enrich/derive/reachable.mjs`, `src/enrich/derive/metrics/`

**Problem**: `enrich-modules.mjs` has a hardcoded sequence of enrichment steps. Each enricher has a different signature — `deriveCycles` takes `IndexedModuleGraph`, `deriveOrphans` takes `modules`, `addDependents` takes `modules`. No shared interface. Adding an enrichment step requires modifying `enrich-modules.mjs`.

**Solution**: Define an enricher interface and a pipeline runner:

```javascript
const enrichers = [
  deriveCycles,
  addDependents,
  deriveOrphans,
  deriveReachable,
  deriveModuleMetrics,
  addFocus,
  addValidations,
  softenKnownViolations,
];

export default function enrichModules(modules, options) {
  return enrichers.reduce((m, enricher) => enricher(m, options), modules);
}
```

**Benefits**:
- **Locality**: Adding/removing enrichers doesn't require touching orchestration code
- **Leverage**: The pipeline is the interface; enrichers are the implementation
- **Testability**: Each enricher conforms to `(modules, options) => modules` — simple contract

---

### 5. Reporter Category Consolidation

**Files**: 19+ files in `src/report/`

**Problem**: Many reporters are <50 lines and share patterns. Error reporters (`err.mjs`, `err-long.mjs`) share formatting logic. DOT reporters (`dot/`, `ddot/`, `archi/`, `flat/`) share theming and module formatting. Each is a **shallow adapter**.

**Solution**: Group reporters into category modules with shared utilities:

- `reporters/text-reporters.mjs`: err, err-long, text, markdown, teamcity, azure-devops, baseline
- `reporters/graph-reporters.mjs`: dot variants with shared theming
- `reporters/data-reporters.mjs`: json, csv, anon, metrics, null

**Benefits**:
- **Locality**: Related reporters share code directly
- **Leverage**: Category entry points are deep — each handles format-specific logic
- **Testability**: Shared utilities reduce test duplication

---

### 6. Async I/O Migration

**Files**: All files in `src/extract/`, `src/cli/`, `src/utl/`

**Problem**: The entire extraction pipeline uses synchronous I/O (`readFileSync`, `readdirSync`, `statSync`, `accessSync`). This blocks the event loop and prevents parallel file processing. For large codebases (>10K files), this is the dominant bottleneck.

**Solution**: Migrate the extraction pipeline to async:

```javascript
// Before
const lAST = toJavascriptAST.getASTCached(join(baseDir, pFileName));

// After
const lAST = await toJavascriptAST.getASTCached(join(baseDir, pFileName));
```

This also enables parallel processing of independent files via `Promise.all`.

**Benefits**:
- **Leverage**: Same interface, dramatically different performance characteristics
- **Testability**: Async functions are still straightforward to test
- **Locality**: Changes concentrated in the I/O layer

**Note**: This is the highest-effort deepening opportunity. It touches most files in the extraction pipeline. Recommend incremental migration starting with `gatherInitialSources.mjs`.
