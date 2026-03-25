import { getCurrentTheme, applyTheme, cycleToNextTheme } from './theme.js';
import { populateParticles, refreshParticles } from './particles.js';
import { fetchBooks, createBookCard } from './books.js';

const booksGrid = document.getElementById('books-grid');
const emptyMessage = document.getElementById('empty-msg');
const tabButtons = document.querySelectorAll('.tab');
const themeToggle = document.getElementById('theme-toggle');
const particleContainer = document.querySelector('.particles');

let books = [];
let activeShelf = 'currently-reading';

// ── initialization ────────────────────────────────────

async function initialize() {
  applyTheme(getCurrentTheme());
  setupTabListeners();
  setupThemeToggle();
  enableGridTransition();

  try {
    books = await fetchBooks();
  } catch {
    showError("couldn't load books.json :(");
    return;
  }

  renderShelf(activeShelf);
  populateParticles(particleContainer);
}

// ── shelf rendering ───────────────────────────────────

function renderShelf(shelf) {
  activeShelf = shelf;
  const booksOnShelf = books.filter(book => book.shelf === shelf);

  fadeOut(booksGrid);

  setTimeout(() => {
    booksGrid.innerHTML = '';

    if (booksOnShelf.length === 0) {
      emptyMessage.hidden = false;
      fadeIn(booksGrid);
      return;
    }

    emptyMessage.hidden = true;

    booksOnShelf.forEach((book, index) => {
      booksGrid.appendChild(createBookCard(book, index));
    });

    requestAnimationFrame(() => fadeIn(booksGrid));
  }, 250);
}

// ── transitions ───────────────────────────────────────

function fadeOut(element) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(12px)';
}

function fadeIn(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
}

function enableGridTransition() {
  booksGrid.style.transition = 'opacity 0.25s ease, transform 0.3s ease';
}

// ── event setup ───────────────────────────────────────

function setupTabListeners() {
  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      activateTab(tab);
      renderShelf(tab.dataset.shelf);
    });
  });
}

function activateTab(selectedTab) {
  tabButtons.forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });
  selectedTab.classList.add('active');
  selectedTab.setAttribute('aria-selected', 'true');
}

function setupThemeToggle() {
  themeToggle.addEventListener('click', () => {
    const nextTheme = cycleToNextTheme();
    applyTheme(nextTheme);
    refreshParticles(particleContainer);
  });
}

// ── error display ─────────────────────────────────────

function showError(message) {
  booksGrid.innerHTML = `<p class="empty-msg">${message}</p>`;
}

// ── start ─────────────────────────────────────────────

initialize();
