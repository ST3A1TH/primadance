

## Plan: Hide Pricing Section

The user wants two things:
1. **Hide the pricing section** from the website (keep the code, just remove it from rendering)
2. The user mentioned the site looks "small and pale" on desktop — this likely refers to the `src/App.css` file which has `max-width: 1280px`, `margin: 0 auto`, `padding: 2rem` on `#root`, constraining the layout

### Changes

1. **`src/pages/Index.tsx`** — Remove `<PricingSection />` from the rendered output (and its import). The component file stays intact for future re-enabling.

2. **`src/components/Header.tsx`** — Remove `"pricing"` from the `navItems` array so it no longer appears in navigation.

3. **`src/App.css`** — Remove the `#root` styles (`max-width`, `margin`, `padding`, `text-align`) that constrain the layout and make it appear small/centered on desktop. These are leftover Vite boilerplate styles.

