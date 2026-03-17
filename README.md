# Brendan Davies

Static site for `brendan-davies.dev`.

- `/` -> Brendan Davies public proof of work
- `/brendan-davies/` -> deeper profile and background
- `/blog/` -> writing and case-study archive
- live companion surface -> `https://jobs.hubsays.media/`

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
- `blog/index.html` - Blog index
- `blog/posts/*.html` - Post pages

## Deployment Notes

Keep links root-relative so routing stays stable in production.
