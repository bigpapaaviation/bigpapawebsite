/* ==========================================================================
   BIG PAPA AIRSHOWS — script.js
   Nav state · scrollspy · reveal animations · next-show badge · lightbox
   ========================================================================== */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: scrolled state ---------- */
  const nav = document.querySelector(".nav");
  const progressBar = document.getElementById("progressBar");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 24);

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    progressBar.style.width = max > 0 ? `${(y / max) * 100}%` : "0%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scrollspy ---------- */
  const navLinks = [...document.querySelectorAll(".nav__link")];
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealer.observe(el));
  }

  /* ---------- Animated counter (about badge) ---------- */
  const counter = document.querySelector("[data-count]");
  if (counter && !prefersReduced) {
    const target = parseInt(counter.dataset.count, 10) || 0;
    const fmt = (n) => n.toLocaleString("en-US");
    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        const dur = 1400;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          counter.textContent = fmt(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(counter);
  }

  /* ---------- Auto "next up" badge on schedule ---------- */
  const rows = [...document.querySelectorAll(".sched__row")];
  if (rows.length) {
    const today = new Date();
    const upcoming = rows
      .map((r) => ({ row: r, date: new Date(`${r.dataset.date}T00:00:00`) }))
      .filter(({ date }) => date >= new Date(today.toDateString()))
      .sort((a, b) => a.date - b.date)[0];
    if (upcoming) {
      upcoming.row.classList.add("is-next");
      const tag = upcoming.row.querySelector(".sched__tag");
      if (tag) {
        tag.textContent = "Next up";
        tag.classList.add("sched__tag--next");
      } else {
        const el = document.createElement("span");
        el.className = "sched__tag sched__tag--next";
        el.textContent = "Next up";
        upcoming.row.appendChild(el);
      }
      // Mirror the next show into the hero chip
      const name = upcoming.row.querySelector("h3")?.textContent.trim();
      const where = upcoming.row.querySelector(".sched__info p")?.textContent.trim();
      const when = upcoming.row.querySelector(".sched__date")?.textContent.replace(/\s+/g, " ").trim();
      const heroNext = document.querySelector(".hero__next");
      if (heroNext && name && where) {
        heroNext.innerHTML =
          '<span class="chip chip--red">Next Up</span> ' +
          `${name} &nbsp;·&nbsp; ${when} &nbsp;·&nbsp; ${where}`;
      }
    }
  }

  /* ---------- Gallery lightbox ---------- */
  const items = [...document.querySelectorAll(".masonry__item")];
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  let current = -1;

  const openLb = (i) => {
    current = (i + items.length) % items.length;
    const item = items[current];
    const img = item.querySelector("img");
    lbImg.src = item.getAttribute("href");
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    current = -1;
  };

  items.forEach((item, i) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openLb(i);
    });
  });
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", () => openLb(current - 1));
  document.getElementById("lbNext").addEventListener("click", () => openLb(current + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(current - 1);
    if (e.key === "ArrowRight") openLb(current + 1);
  });
})();
