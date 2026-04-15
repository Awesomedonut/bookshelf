import { getCurrentTheme, applyTheme, cycleToNextTheme } from './theme.js';
import { populateParticles, refreshParticles } from './particles.js';
import { fetchBooks, createShelfSection, SHELVES } from './books.js';

const shelvesContainer = document.getElementById('shelves');
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const particleContainer = document.querySelector('.particles');

let allBooks = [];

// ── initialization ────────────────────────────────────

async function initialize() {
  applyTheme(getCurrentTheme());
  setupThemeToggle();
  setupSearch();

  try {
    allBooks = await fetchBooks();
  } catch {
    showError("couldn't load books.json :(");
    return;
  }

  renderAllShelves(allBooks);
  updateCounter(allBooks);
  populateParticles(particleContainer);
}

// ── shelf rendering ───────────────────────────────────

function renderAllShelves(books) {
  shelvesContainer.innerHTML = '';
  let staggerOffset = 0;

  SHELVES.forEach(shelf => {
    const { element, bookCount } = createShelfSection(shelf, books, staggerOffset);
    shelvesContainer.appendChild(element);
    staggerOffset += bookCount;
  });
}

// ── search ────────────────────────────────────────────

function setupSearch() {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      renderAllShelves(allBooks);
      updateCounter(allBooks);
      return;
    }
    const filtered = allBooks.filter(book =>
      [book.title, book.author, book.comment, book.shelf]
        .filter(Boolean)
        .some(field => field.toLowerCase().includes(query))
    );
    renderAllShelves(filtered);
    updateCounter(filtered, allBooks.length);
  });
}

function updateCounter(shown, total) {
  const counter = document.getElementById('book-counter');
  if (total && shown.length !== total) {
    counter.textContent = `${shown.length} of ${total} books`;
  } else {
    counter.textContent = `${shown.length} book${shown.length === 1 ? '' : 's'}`;
  }
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
