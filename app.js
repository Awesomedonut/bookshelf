import { getCurrentTheme, applyTheme, cycleToNextTheme } from './theme.js';
import { populateParticles, refreshParticles } from './particles.js';
import { fetchBooks, createShelfSection, SHELVES } from './books.js';

const shelvesContainer = document.getElementById('shelves');
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const bookCounter = document.getElementById('book-counter');
const particleContainer = document.querySelector('.particles');

let allBooks = [];

async function initialize() {
  applyTheme(getCurrentTheme());
  setupThemeToggle();
  setupSearch();

  try {
    allBooks = await fetchBooks();
  } catch {
    shelvesContainer.innerHTML = `<p class="empty-msg">couldn't load books.json :(</p>`;
    return;
  }

  renderAllShelves(allBooks);
  updateCounter(allBooks);
  populateParticles(particleContainer);
}

function renderAllShelves(books) {
  shelvesContainer.innerHTML = '';
  let staggerOffset = 0;

  SHELVES.forEach(shelf => {
    const { element, bookCount } = createShelfSection(shelf, books, staggerOffset);
    shelvesContainer.appendChild(element);
    staggerOffset += bookCount;
  });
}

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
  if (total && shown.length !== total) {
    bookCounter.textContent = `${shown.length} of ${total} books`;
  } else {
    bookCounter.textContent = `${shown.length} book${shown.length === 1 ? '' : 's'}`;
  }
}

function setupThemeToggle() {
  themeToggle.addEventListener('click', () => {
    const nextTheme = cycleToNextTheme();
    applyTheme(nextTheme);
    refreshParticles(particleContainer);
  });
}

initialize();
