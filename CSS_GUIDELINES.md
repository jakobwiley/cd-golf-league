# CSS Guidelines for CD Golf League

## Preventing CSS Styling Issues

The application uses Tailwind CSS for styling. To prevent CSS styling issues when making changes, follow these guidelines:

### 1. Always Rebuild CSS After Component Changes

After creating or modifying components, especially when adding new Tailwind classes, run:

```bash
npm run rebuild-css
```

This ensures that all CSS classes are properly generated and included in the build.

### 2. Use Explicit Class Names

When possible, use explicit class names instead of dynamic or computed class names:

```tsx
// Good
<div className="text-white bg-[#030f0f] border-[#00df82]">

// Avoid when possible
<div className={`text-${dynamicColor}`}>
```

### 3. Add Critical Classes to the Safelist

If you need to use dynamic class names, add the possible values to the safelist in `tailwind.config.js`:

```js
// In tailwind.config.js
module.exports = {
  // ...
  safelist: [
    'text-[#00df82]',
    'bg-[#030f0f]',
    // Add other critical classes here
  ]
}
```

### 4. Use Component Attributes for Debugging

Add `data-component-name` attributes to help identify components in the DOM:

```tsx
<div className="..." data-component-name="MatchPointTracker">
```

### 5. Build Process

The build process now automatically rebuilds CSS to ensure all styles are included:

- Development: CSS is rebuilt when the server starts
- Production: CSS is rebuilt during the build process

### 6. Troubleshooting CSS Issues

If you encounter CSS styling issues:

1. Check if the component is using dynamic class names not in the safelist
2. Run `npm run rebuild-css` to regenerate the CSS
3. Restart the development server with `npm run dev`
4. Verify the component has the expected classes in the browser inspector
5. Check for any CSS conflicts or specificity issues

By following these guidelines, we can minimize CSS styling issues in the application.
