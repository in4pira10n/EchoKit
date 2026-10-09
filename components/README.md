# EchoKit Components

Each shared component lives in its own directory and owns its canonical implementation files:

```text
components/<component>/
├── index.js
├── <component>.js
├── <component>.css
├── <component>.d.ts
└── README.md
```

Global tokens stay in `tokens/`, shared SF Symbol assets stay in `SFSymbols/`, and `components/icon.js` resolves bare symbol names or explicit custom URLs. Components preserve each icon's intrinsic aspect ratio by sizing its height and leaving its width natural. `css/echokit.css` remains the stylesheet entry point for apps that want the complete kit.

Each component's `README.md` is its public interface contract. Add or change a public field there before treating it as part of the shared API.

The initial field-hint requirements for component detail pages are collected in [`../principles/component principles.md`](../principles/component%20principles.md). Keep those hints focused on the smallest useful configuration surface; component implementation and advanced API details stay in each component's own README.

There is intentionally no second `components/` tree under `js/` or `css/`. Runtime entry points re-export the canonical files from this directory so consumers have one source of truth.
