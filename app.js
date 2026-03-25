import { getCurrentTheme, applyTheme, cycleToNextTheme } from './theme.js';
import { populateParticles, refreshParticles } from './particles.js';
import { fetchBooks, createShelfSection, SHELVES } from './books.js';

const shelvesContainer = document.getElementById('shelves');
const themeToggle = document.getElementById('theme-toggle');
const particleContainer = document.querySelector('.particles');

// ── initialization ────────────────────────────────────

async function initialize() {
  applyTheme(getCurrentTheme());
  setupThemeToggle();

  let books;
  try {
    books = await fetchBooks();
  } catch {
    showError("couldn't load books.json :(");
    return;
  }

  renderAllShelves(books);
  populateParticles(particleContainer);
}

// ── shelf rendering ───────────────────────────────────

function renderAllShelves(books) {
  let staggerOffset = 0;

  SHELVES.forEach(shelf => {
    const { element, bookCount } = createShelfSection(shelf, books, staggerOffset);
    shelvesContainer.appendChild(element);
    staggerOffset += bookCount;
  });
}

// ── event setup ───────────────────────────────────────

function setupThemeToggle() {
  themeToggle.addEventListener('click', () => {
    const nextTheme = cycleToNextTheme();
    applyTheme(nextTheme);
    refreshParticles(particleContainer);
  });
}

// ── error display ─────────────────────────────────────

function showError(message) {
  shelvesContainer.innerHTML = `<p class="empty-msg">${message}</p>`;
}

// ── start ─────────────────────────────────────────────

initialize();
