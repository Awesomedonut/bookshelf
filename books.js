const ANIMATION_STAGGER_MS = 100;
const MAX_RATING = 5;

export async function fetchBooks() {
  const response = await fetch('books.json');
  return response.json();
}

export function createBookCard(book, index) {
  const card = document.createElement('div');
  card.className = 'book';
  card.style.setProperty('--delay', `${index * ANIMATION_STAGGER_MS}ms`);

  card.innerHTML = `
    <div class="book-info">
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
