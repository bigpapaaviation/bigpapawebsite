# Big Papa Airshows

Single-page site for Big Papa Aviation — Ben "Big Papa" Ausbrooks, retired USMC F/A-18 pilot
flying aerobatics in his Steen Super Skybolt. *Professional Aviator · Positive Attitude.*

Static site — plain HTML/CSS/JS, no build step. Live at:
**https://YOUR_USERNAME.github.io/bigpapaaviation/** (GitHub Pages, deployed from `main`)

## Edit content

| What            | Where |
|-----------------|-------|
| Schedule dates  | `index.html` → `#schedule` section (`data-date` drives the auto "Next up" badge) |
| Bio / aircraft  | `index.html` → `#about`, `#aircraft` |
| Photos          | drop files in `assets/img/`, add `<a>` entries in `#gallery` |
| Colors / fonts  | `styles.css` → `:root` variables |

Pushing to `main` redeploys automatically.
