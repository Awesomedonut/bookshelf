const ANIMATION_STAGGER_MS = 100;
const MAX_RATING = 5;

export const SHELVES = [
  { id: 'currently-reading', label: 'Currently Reading' },
  { id: 'read',              label: 'Read' },
  { id: 'want-to-read',     label: 'Want to Read' },
  { id: 'marinating',        label: 'Skimmed & For Later' },
];

export async function fetchBooks() {
  const response = await fetch('books.json');
  return response.json();
}

export function createShelfSection(shelf, books, staggerOffset) {
  const booksOnShelf = books
    .filter(book => book.shelf === shelf.id)
    .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  const section = document.createElement('section');
  section.className = 'shelf-section';

  const label = document.createElement('h2');
  label.className = 'shelf-label';
  label.textContent = shelf.label;
  section.appendChild(label);

  const container = document.createElement('div');
  container.className = 'shelf-container';

  const grid = document.createElement('div');
  grid.className = 'books-grid';

  if (booksOnShelf.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-msg';
    emptyMsg.textContent = 'nothing here yet...';
    grid.appendChild(emptyMsg);
  } else {
    booksOnShelf.forEach((book, index) => {
      grid.appendChild(createBookCard(book, staggerOffset + index));
    });
  }

  const plank = document.createElement('div');
  plank.className = 'shelf-plank';

  container.appendChild(grid);
  container.appendChild(plank);
  section.appendChild(container);

  return { element: section, bookCount: booksOnShelf.length };
}

export function createBookCard(book, index) {
  const card = document.createElement('div');
  card.className = `book${book.starred ? ' starred' : ''}`;
  card.style.setProperty('--delay', `${index * ANIMATION_STAGGER_MS}ms`);

  card.innerHTML = `
    <div class="book-info">
      ${book.starred ? '<div class="star-badge">&#9733;</div>' : ''}
      <div class="title">${escapeHtml(book.title)}</div>
      <div class="author">${escapeHtml(book.author)}</div>
      ${renderRating(book.rating)}
      ${renderComment(book.comment)}
    </div>
    <div class="book-cover-wrapper">
      <img src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.title)}" loading="lazy">
    </div>
  `;

  return card;
}

function renderRating(rating) {
  if (!rating) return '';

  const filled = '&#x2665;'.repeat(rating);
  const empty = '&#x2665;'.repeat(MAX_RATING - rating);

  return `<div class="rating"><span aria-label="${rating} out of ${MAX_RATING}">${filled}<span style="opacity:.25">${empty}</span></span></div>`;
}

function renderComment(comment) {
  if (!comment) return '';
  return `<div class="comment">&ldquo;${escapeHtml(comment)}&rdquo;</div>`;
}

function escapeHtml(text) {
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
}
