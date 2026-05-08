---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# React Architecture Rules

## Container / Presentational Pattern

Every feature follows a strict three-layer split:

### Custom Hooks (`src/hooks/`)
- Own **all logic**: state, derived values, API calls, event handlers
- Return plain values and callbacks — no JSX
- Never import from presentational component files
- Avoid `useEffect` as much as possible — prefer deriving values from state or handling side effects through event handlers

### Container Components
- Import one or more custom hooks
- Pass hook results directly as props to a presentational component
- No JSX beyond rendering the presentational component
- No `useState`, `useEffect`, or inline logic — delegate everything to the hook

### Presentational Components
- Accept props only — pure UI
- No custom hooks (except `useRef` for DOM access)
- No `useEffect`
- No handlers defined here — receive them as props
- No logic: no conditionals that compute values, no data transformation

## Folder Structure & Naming

```
SomeFeature/
├── SomeFeatureContainer.tsx   # container
├── SomeFeature.tsx            # presentational
└── components/
    └── Child/
        ├── ChildContainer.tsx
        ├── Child.tsx
        └── hooks/
            └── useChild.ts
```

- Feature name is the prefix for both container and presentational files
- Each child component lives in its own named subdirectory under `components/`
- Hooks scoped to a child component live inside that child's `hooks/` directory
- Shared/top-level hooks live in `src/hooks/`

## Enforcement Checklist

Before finishing any component, verify:
- [ ] Logic lives in a hook, not in a component
- [ ] Container does nothing except wire hook → presentational
- [ ] Presentational component has zero side effects
- [ ] Files follow the naming and folder structure above
