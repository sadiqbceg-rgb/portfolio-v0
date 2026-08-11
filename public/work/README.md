# Project images

Files here are served from the site root with the `public` prefix removed:

| File on disk                      | URL in the browser        | Value for `image` |
| --------------------------------- | ------------------------- | ----------------- |
| `public/work/it-solutions.jpeg`   | `/work/it-solutions.jpeg` | `/work/it-solutions.jpeg` |

Set it on the matching entry in `src/content/site.ts`:

```ts
{
  title: 'Building Complete IT Systems',
  image: '/work/it-solutions.jpeg',
  ...
}
```

## Naming rules

- **No spaces.** `it solutions.jpeg` has to be written `/work/it%20solutions.jpeg`,
  which works on a local dev server but is not reliable across every host. Use
  hyphens.
- **Lowercase.** Filenames are case-sensitive once deployed. Windows will serve
  `IT-Solutions.JPEG` for a request to `it-solutions.jpeg` locally and then
  404 in production, which is a genuinely confusing way to lose an hour.
- **Keep the extension honest.** A `.jpeg` file renamed to `.png` still fails.

## If an image does not appear

The card falls back to its generated artwork rather than showing a broken
frame, so check the browser console — the failure is logged with the exact
path that was requested.

Leaving `image` unset is a valid choice: the generated canvas renders instead.
