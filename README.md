# Brendan Davies

Static site for `brendan-davies.dev`.

- `/` -> Brendan Davies public proof of work
- `/brendan-davies/` -> deeper profile and background
- `/blog/` -> retired archive landing for legacy long-form posts
- active studio surface -> `https://hubsays.com/`

## Stack

- Plain HTML/CSS/JS (no build system required)
- GitHub Pages-compatible static deployment
- No auth, no tracking scripts

## Local Preview

Serve the directory with any static server, for example:

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Structure

- `index.html` - personal landing page
- `brendan-davies/index.html` - deeper profile page
- `blog/index.html` - retired archive landing
- `blog/posts/*.html` - legacy archive pages kept live by direct link

## Deployment Notes

Keep links root-relative so routing stays stable in production.
