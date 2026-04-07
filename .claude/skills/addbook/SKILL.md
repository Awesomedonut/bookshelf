---
name: addbook
description: Add a book to the bookshelf app. User provides title, author, shelf, and optionally a comment/rating/starred flag. This skill finds a cover image, downloads it locally, and adds the book entry to books.json.
version: 1.0.0
---

# /addbook — Add a Book to the Shelf

## Workflow

1. **Parse the user's request.** Extract:
   - Title
   - Author
   - Shelf (defaults to the last shelf mentioned in conversation, or ask)
   - Comment (optional)
   - Rating 1-5 (optional)
   - Starred true/false (optional)
   - Edition preference (if mentioned)

2. **Find a cover image.** Try sources in this order:
   a. Search Open Library: `https://openlibrary.org/search.json?q={title}+{author}&fields=key,title,cover_i,isbn,author_name&limit=5`
   b. If a `cover_i` is found, download from: `https://covers.openlibrary.org/b/id/{cover_i}-L.jpg`
   c. If no `cover_i`, try ISBNs: `https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg`
   d. Verify the downloaded file is a real JPEG/PNG (not a 1x1 GIF placeholder). Check with `file` command — if it says "GIF image data, version 89a, 1 x 1", it's a placeholder.
   e. If Open Library fails, fall back to Google Books: `https://books.google.com/books/content?vid=ISBN{isbn}&printsec=frontcover&img=1&zoom=1`
   f. If the user specified an edition, make sure to find the correct ISBN for that edition.

3. **Download the cover locally.** ALWAYS save to `covers/{slug}.jpg` where slug is a kebab-case version of `{title}-{author-last-name}`. Never hotlink external URLs in books.json.

4. **Visually verify the cover.** Use the Read tool on the downloaded image to confirm it looks correct. Tell the user what you see so they can confirm.

5. **Add the book to books.json.** Append a new entry:
   ```json
   {
     "title": "...",
     "author": "...",
     "cover": "covers/{slug}.jpg",
     "shelf": "...",
     "comment": "...",
     "rating": 3,
     "starred": true,
     "dateAdded": "YYYY-MM-DD"
   }
   ```
   - Omit optional fields (comment, rating, starred) if not provided.
   - Use today's date for `dateAdded`.

6. **Tell the user** the book was added and whether the cover looks right.

## Valid Shelves

Check `books.js` for the current `SHELVES` array to see valid shelf IDs.

## Important Rules

- NEVER hotlink external cover URLs. Always download to `covers/`.
- Always verify downloaded images aren't placeholders (1x1 GIF).
- If multiple editions exist, prefer the edition the user specifies.
- If no cover can be found at all, tell the user and still add the book with a placeholder path they can replace manually.
