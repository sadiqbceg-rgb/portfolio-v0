# Project images

Files here are served from the site root with the `public` prefix removed.

| File on disk                    | URL in the browser       | Value for `image`        |
| ------------------------------- | ------------------------ | ------------------------ |
| `public/work/it-solutions.jpg`  | `/work/it-solutions.jpg` | `/work/it-solutions.jpg` |

Set it on the matching entry in `src/content/site.ts`:

```ts
{
  title: 'Building Complete IT Systems',
  image: '/work/it-solutions.jpg',
  ...
}
```

## Currently in use

Every file below is referenced by a project. There are no spares.

- `it-solutions.jpg`
- `sketch-to-image.jpg`
- `face-recognition.jpg`
- `travel-assistant.jpg`
- `smart-queue.jpg`
- `space-economy.jpg`
- `rapido-referral.webp`
- `discord-notifications.jpg`
- `gpay-heuristic.webp`

## Naming rules

These are not style preferences. Each one has already broken this folder once.

- **Lowercase, including the directory.** The images first arrived in a
  directory named with a capital W while the code asked for the lowercase
  form. Windows and macOS treat those as the same folder, so it looked fine
  locally; Linux does not, and Linux is what the host runs. Every image would
  have 404'd in production only.
- **No spaces.** A space has to be percent-encoded in the URL. That survives a
  dev server but not reliably every CDN.
- **Match the extension exactly.** A `.jpg` file referenced with a `.jpeg`
  extension is a 404, and the two are easy to mix up.

## If an image does not appear

The card falls back to its generated artwork rather than showing a broken
frame, so check the browser console — the failure is logged with the exact
path that was requested.

Note that Next.js caches optimised images in `.next/cache/images`. After
replacing a file, clear it (`Remove-Item -Recurse -Force .next` on Windows,
`rm -rf .next` elsewhere) or you may keep seeing the old one.

Leaving `image` unset is a valid choice: the generated canvas renders instead.
