# Dependency Cruiser — Feature Audit

_Auto-generated 2026-05-03 by comprehensive codebase audit_

## Status Legend

| Status | Meaning |
|--------|---------|
| ✅ FULLY_FUNCTIONAL | Feature works completely |
| ⚠️ PARTIALLY_FUNCTIONAL | Feature works but has known gaps |
| 🔧 EXPERIMENTAL | Feature exists but may change without major version bump |
| 🚧 PLANNED | Documented/desired but not yet implemented |
| ❌ BROKEN | Feature exists but is currently broken |

---

## Core Engine

| Feature | Status | Description |
|---------|--------|-------------|
| Dependency extraction (ES6/CJS/AMD) | ✅ FULLY_FUNCTIONAL | Recursive dependency extraction from JS/TS/CoffeeScript/LiveScript/Vue/Svelte |
| Circular dependency detection | ✅ FULLY_FUNCTIONAL | Detects and reports cycles with full path |
| Rule-based validation | ✅ FULLY_FUNCTIONAL | forbidden/allowed/required rules with regex path matching |
| Folder-level validation (`scope: "folder"`) | 🔧 EXPERIMENTAL | Folder-scope rules for cycles and instability |
| Stability metrics (afferent/efferent/instability) | ✅ FULLY_FUNCTIONAL | Per-module and per-folder metrics |
| Dependency type classification | ✅ FULLY_FUNCTIONAL | local, npm, npm-dev, npm-optional, npm-peer, npm-bundled, core, aliased, unknown, type-only |
| Module metrics derivation | ✅ FULLY_FUNCTIONAL | Orphan detection, dependents, reachable analysis |
| Caching (metadata + content strategy) | ✅ FULLY_FUNCTIONAL | Speed up re-cruises with git metadata or content hashing |
| Baseline/known violations | ✅ FULLY_FUNCTIONAL | `--ignore-known` + `depcruise-baseline` for managing technical debt |

## Transpilation & Parsing

| Feature | Status | Description |
|---------|--------|-------------|
| JavaScript (ES6/CJS/AMD) parsing | ✅ FULLY_FUNCTIONAL | Via acorn |
| TypeScript parsing | ✅ FULLY_FUNCTIONAL | Via TypeScript compiler API |
| CoffeeScript transpilation | ✅ FULLY_FUNCTIONAL | Via coffeescript package |
| LiveScript transpilation | ✅ FULLY_FUNCTIONAL | Via livescript package |
| Vue SFC (v2) | ✅ FULLY_FUNCTIONAL | Via vue-template-compiler |
| Vue SFC (v3) | ✅ FULLY_FUNCTIONAL | Via @vue/compiler-sfc |
| Svelte | ⚠️ PARTIALLY_FUNCTIONAL | Pinned to svelte <4.0.0; svelte 4+ support pending |
| Babel transpilation | ⚠️ PARTIALLY_FUNCTIONAL | Not optimally efficient; applies to all JS/TS; no function-config support |
| SWC parser | 🔧 EXPERIMENTAL | Via `parser: "swc"` option |
| JSX/TSX/CSX/CJSX | ✅ FULLY_FUNCTIONAL | Via acorn + acorn-jsx |
| Pre-compilation TypeScript deps | ✅ FULLY_FUNCTIONAL | `tsPreCompilationDeps` option |

## CLI Tools

| Feature | Status | Description |
|---------|--------|-------------|
| `dependency-cruise` / `depcruise` | ✅ FULLY_FUNCTIONAL | Main CLI command |
| `depcruise-fmt` | ✅ FULLY_FUNCTIONAL | Re-format saved JSON cruise output with any reporter |
| `depcruise-baseline` | ✅ FULLY_FUNCTIONAL | Generate/update known violations baseline |
| `depcruise-wrap-stream-in-html` | ✅ FULLY_FUNCTIONAL | Interactive HTML wrapper for SVG graphs |
| `--init` interactive config | ✅ FULLY_FUNCTIONAL | Generates .dependency-cruiser config with smart defaults |
| `--info` | ✅ FULLY_FUNCTIONAL | Show available transpilers and extensions |
| Progress reporting | ✅ FULLY_FUNCTIONAL | cli-feedback, performance-log, ndjson, none |

## Output Reporters (19 formats)

| Format | Status | Description |
|--------|--------|-------------|
| `err` | ✅ FULLY_FUNCTIONAL | Human-readable violations to stderr |
| `err-long` | ✅ FULLY_FUNCTIONAL | Like err with rule comment |
| `dot` | ✅ FULLY_FUNCTIONAL | GraphViz DOT directed graph |
| `ddot` | ✅ FULLY_FUNCTIONAL | DOT at folder level |
| `archi` / `cdot` | ✅ FULLY_FUNCTIONAL | DOT at architecture level (custom collapse) |
| `flat` / `fdot` | ✅ FULLY_FUNCTIONAL | DOT with all modules flat |
| `mermaid` | ✅ FULLY_FUNCTIONAL | Mermaid flowchart (GitHub/GitLab compatible) |
| `err-html` | ✅ FULLY_FUNCTIONAL | Standalone HTML violation report |
| `html` | ✅ FULLY_FUNCTIONAL | HTML dependency matrix |
| `markdown` | ✅ FULLY_FUNCTIONAL | Markdown report (GitHub Actions compatible) |
| `csv` | ✅ FULLY_FUNCTIONAL | CSV dependency matrix |
| `teamcity` | ✅ FULLY_FUNCTIONAL | TeamCity service messages |
| `azure-devops` | ✅ FULLY_FUNCTIONAL | Azure DevOps logging commands |
| `text` | ✅ FULLY_FUNCTIONAL | Flat text for grep-ping |
| `json` | ✅ FULLY_FUNCTIONAL | Full cruise result as JSON |
| `anon` | ✅ FULLY_FUNCTIONAL | Anonymized JSON (safe sharing) |
| `baseline` | ✅ FULLY_FUNCTIONAL | Violations list for --ignore-known |
| `metrics` | ✅ FULLY_FUNCTIONAL | Stability metrics table |
| `null` | ✅ FULLY_FUNCTIONAL | No output, exit code only |
| Plugin reporters | ✅ FULLY_FUNCTIONAL | Custom reporters via `--output-type plugin:my-plugin` |

## Filtering & Visualization

| Feature | Status | Description |
|---------|--------|-------------|
| `--include-only` | ✅ FULLY_FUNCTIONAL | Regex-based inclusion filter |
| `--exclude` | ✅ FULLY_FUNCTIONAL | Regex-based exclusion (incl. dynamic imports) |
| `--focus` | ✅ FULLY_FUNCTIONAL | Focus on module + neighbours (configurable depth) |
| `--reaches` | ✅ FULLY_FUNCTIONAL | Show module + all transitive dependents |
| `--highlight` | ✅ FULLY_FUNCTIONAL | Visual highlight (not a filter) |
| `--collapse` | ✅ FULLY_FUNCTIONAL | Collapse to folder depth or regex pattern |
| `--max-depth` | ✅ FULLY_FUNCTIONAL | Limit cruise depth |
| `--do-not-follow` | ✅ FULLY_FUNCTIONAL | Stop following matching dependencies |
| DOT theming | ✅ FULLY_FUNCTIONAL | Customizable graph, node, edge styling |

## Resolution

| Feature | Status | Description |
|---------|--------|-------------|
| CommonJS resolution | ✅ FULLY_FUNCTIONAL | Full CJS require.resolve semantics |
| ES module resolution | ✅ FULLY_FUNCTIONAL | ESM import resolution |
| AMD resolution | ⚠️ PARTIALLY_FUNCTIONAL | Basic AMD resolution; no require.config support |
| TypeScript path aliases | ✅ FULLY_FUNCTIONAL | Via tsconfig.json paths |
| Webpack resolve aliases | ✅ FULLY_FUNCTIONAL | Via webpack config |
| Monorepo support | ✅ FULLY_FUNCTIONAL | Closest package.json per module |
| Yarn Plug'n'Play | ⚠️ PARTIALLY_FUNCTIONAL | Auto-detected for yarn 3+; yarn 1 PnP dropped in v13 |
| Package exports field | ✅ FULLY_FUNCTIONAL | Via enhanced-resolve |
| Exotic require strings | ✅ FULLY_FUNCTIONAL | Custom require wrappers via `exoticRequireStrings` |

## API Surface

| Feature | Status | Description |
|---------|--------|-------------|
| `cruise()` API | ✅ FULLY_FUNCTIONAL | Main programmatic API |
| `format()` API | ✅ FULLY_FUNCTIONAL | Re-format saved results |
| `allExtensions` | ✅ FULLY_FUNCTIONAL | List of all supported file extensions |
| `getAvailableTranspilers()` | ✅ FULLY_FUNCTIONAL | List detected transpilers |
| `extract-babel-config` utility | ✅ FULLY_FUNCTIONAL | Read babel config |
| `extract-depcruise-config` utility | ✅ FULLY_FUNCTIONAL | Read depcruise config |
| `extract-ts-config` utility | ✅ FULLY_FUNCTIONAL | Read tsconfig |
| `extract-webpack-resolve-config` utility | ✅ FULLY_FUNCTIONAL | Read webpack resolve config |

## Planned / Not Yet Implemented

| Feature | Status | Source |
|---------|--------|--------|
| Folder-scope `via`/`viaOnly`/`viaSomeNot`/`viaNot` | 🚧 PLANNED | rules-reference.md |
| Reachable rule `from`/`to` beyond path/pathNot | 🚧 PLANNED | rules-reference.md |
| Additional `exclude` attributes beyond `dynamic` | 🚧 PLANNED | options-reference.md |
| Babel per-extension scoping | 🚧 PLANNED | options-reference.md |
| Babel config function exports | 🚧 PLANNED | options-reference.md |
| `--ignore-known` for dot/html/teamcity | 🚧 PLANNED | cli.md |
| Better JSX import/export in fragments | 🚧 PLANNED | faq.md |
| AMD require.config support | 🚧 PLANNED | resolve-amd.mjs comments |
