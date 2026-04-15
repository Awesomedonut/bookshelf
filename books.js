const ANIMATION_STAGGER_MS = 100;
const MAX_RATING = 5;

// pastel spine palette — cycles through these based on book index
const SPINE_COLORS = [
  { bg: '#E8D5C4', text: '#5C3D2E' },  // warm linen
  { bg: '#C9B1D0', text: '#4A2D5E' },  // lavender
  { bg: '#A7C7C8', text: '#2C4F50' },  // sage
  { bg: '#F2C6B4', text: '#7A3B2E' },  // peach
  { bg: '#B5C9A8', text: '#3A4F2E' },  // moss
  { bg: '#D4A5A5', text: '#5E2D2D' },  // dusty rose
  { bg: '#C4D4E0', text: '#2E3F52' },  // powder blue
  { bg: '#E0C8A8', text: '#5C4426' },  // sand
  { bg: '#D1B3C4', text: '#4F2A3E' },  // mauve
  { bg: '#A8C4B8', text: '#2E4F3E' },  // mint
  { bg: '#E6CDAB', text: '#6B4F2A' },  // honey
  { bg: '#B8A9C9', text: '#3D2E5C' },  // wisteria
  { bg: '#C8D8B8', text: '#3E4F2E' },  // pistachio
  { bg: '#E0B8B8', text: '#5C2E2E' },  // blush
  { bg: '#A8BCD4', text: '#2E3E5C' },  // steel blue
  { bg: '#D4C4A8', text: '#5C4F2E' },  // wheat
];

export const SHELVES = [
  { id: 'currently-reading', label: 'Currently Reading' },
  { id: 'read',              label: 'Read' },
  { id: 'want-to-read',     label: 'Want to Read' },
  { id: 'marinating',        label: 'Skimmed & For Later' },
  { id: 'on-hold',           label: 'On Hold' },
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
  const isCover = book.showCover;
  const card = document.createElement('div');
  card.className = `book${book.starred ? ' starred' : ''}${isCover ? '' : ' spine-view'}`;
  card.style.setProperty('--delay', `${index * ANIMATION_STAGGER_MS}ms`);

  const popover = `
    <div class="book-info">
      ${book.starred ? '<div class="star-badge">&#9733;</div>' : ''}
      <div class="title">${escapeHtml(book.title)}</div>
      <div class="author">${escapeHtml(book.author)}</div>
      ${renderRating(book.rating)}
      ${renderComment(book.comment)}
    </div>`;

  if (isCover) {
    card.innerHTML = `
      ${popover}
      <div class="book-cover-wrapper">
        <img src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.title)}" loading="lazy">
      </div>`;
  } else {
    const color = SPINE_COLORS[index % SPINE_COLORS.length];
    card.innerHTML = `
      ${popover}
      <div class="book-spine" style="background: ${color.bg}; color: ${color.text};">
        <span class="spine-title">${escapeHtml(book.title)}</span>
      </div>`;
  }

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
