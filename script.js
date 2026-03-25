(() => {
  const grid = document.getElementById('books-grid');
  const emptyMsg = document.getElementById('empty-msg');
  const tabs = document.querySelectorAll('.tab');
  const themeBtn = document.getElementById('theme-toggle');
  let books = [];
  let currentShelf = 'currently-reading';

  // ── theme ───────────────────────────────────────────
  const THEMES = ['cozy', 'retro'];

  function getTheme() {
    return localStorage.getItem('bookshelf-theme') || 'cozy';
  }

  function setTheme(name) {
    localStorage.setItem('bookshelf-theme', name);
    if (name === 'cozy') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = name;
    }
    // recreate particles with theme-appropriate style
    recreateParticles();
  }

  function cycleTheme() {
    const cur = getTheme();
    const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
    setTheme(next);
  }

  themeBtn.addEventListener('click', cycleTheme);

  // apply saved theme immediately
  setTheme(getTheme());

  // ── fetch & render ──────────────────────────────────
  async function init() {
    try {
      const res = await fetch('books.json');
      books = await res.json();
    } catch {
      grid.innerHTML = '<p class="empty-msg">couldn\'t load books.json :(</p>';
      return;
    }

    renderShelf(currentShelf);
    createParticles();
  }

  function renderShelf(shelf) {
    currentShelf = shelf;
    const filtered = books.filter(b => b.shelf === shelf);

    // crossfade out
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(12px)';

    setTimeout(() => {
      grid.innerHTML = '';

      if (filtered.length === 0) {
        emptyMsg.hidden = false;
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
        return;
      }

      emptyMsg.hidden = true;

      filtered.forEach((book, i) => {
        const el = createBookCard(book, i);
        grid.appendChild(el);
      });

      // crossfade in
      requestAnimationFrame(() => {
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      });
    }, 250);
  }

  // ── book card ───────────────────────────────────────
  function createBookCard(book, index) {
    const el = document.createElement('div');
    el.className = 'book';
    el.style.setProperty('--delay', `${index * 100}ms`);

    const ratingHTML = book.rating
      ? `<div class="rating">${hearts(book.rating)}</div>`
      : '';

    const commentHTML = book.comment
      ? `<div class="comment">"${book.comment}"</div>`
      : '';

    el.innerHTML = `
      <div class="book-info">
        <div class="title">${esc(book.title)}</div>
        <div class="author">${esc(book.author)}</div>
        ${ratingHTML}
        ${commentHTML}
      </div>
      <div class="book-cover-wrapper">
        <img src="${esc(book.cover)}" alt="${esc(book.title)}" loading="lazy">
      </div>
    `;

    return el;
  }

  function hearts(n) {
    return '<span aria-label="' + n + ' out of 5">'
      + '&#x2665;'.repeat(n)
      + '<span style="opacity:.25">' + '&#x2665;'.repeat(5 - n) + '</span>'
      + '</span>';
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // ── tabs ────────────────────────────────────────────
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderShelf(tab.dataset.shelf);
    });
  });

  // ── crossfade transition on grid ────────────────────
  grid.style.transition = 'opacity 0.25s ease, transform 0.3s ease';

  // ── particles ───────────────────────────────────────
  function createParticles() {
    const container = document.querySelector('.particles');
    const isRetro = getTheme() === 'retro';
    const count = isRetro ? 25 : 18;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = (60 + Math.random() * 40) + '%';

      if (isRetro) {
        // smaller, more sparkly for retro
        const size = (2 + Math.random() * 4) + 'px';
        p.style.width = p.style.height = size;
        p.style.animationDuration = (5 + Math.random() * 10) + 's';
        p.style.animationDelay = (Math.random() * 8) + 's';
        const colors = ['#FF69B4', '#CC00FF', '#00FFFF', '#FFE100'];
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
      } else {
        const size = (3 + Math.random() * 5) + 'px';
        p.style.width = p.style.height = size;
        p.style.animationDuration = (8 + Math.random() * 14) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        p.style.background = Math.random() > 0.5
          ? 'var(--gold)'
          : 'var(--dusty-rose)';
      }

      container.appendChild(p);
    }
  }

  function recreateParticles() {
    const container = document.querySelector('.particles');
    container.innerHTML = '';
    createParticles();
  }

  // ── go ──────────────────────────────────────────────
  init();
})();
