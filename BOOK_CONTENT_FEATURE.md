# Book Content Publishing Feature

## Overview
Added support for storing and managing book content during the publication process. Publishers can now add book content in two ways:
1. **Direct Text Input**: Write or paste book content directly in a textarea
2. **File Upload**: Upload `.txt` or `.pdf` files with automatic content extraction

## Backend Changes

### Database Schema (`src/models/book.js`)
- Added `content` field (String, default: "")
- Stores the full text of the book

### API Endpoints

#### POST `/api/v1/books` (Existing)
- Updated to accept optional `content` field
- Example request:
```json
{
  "ISBN": "978-1234567890",
  "title": "My Book",
  "author": "Author Name",
  "content": "Book content here..."
}
```

#### POST `/api/v1/books/:bookId/content` (New)
- Upload and update book content for existing books
- Supports two input methods:
  - File upload: `multipart/form-data` with `contentFile` field (`.txt` or `.pdf`)
  - Direct text: JSON body with `textContent` field
- Example (file upload):
```bash
curl -X POST http://localhost:3000/api/v1/books/123/content \
  -H "Authorization: Bearer <token>" \
  -F "contentFile=@book.pdf"
```

### Validation
- Book validators updated in `src/validators/book-validators.js`
- `content` field is optional for publish endpoint
- Supported file types: `.txt`, `.pdf`

### File Processing
- `.txt` files: Direct UTF-8 text extraction
- `.pdf` files: Uses `pdf-parse` library for text extraction
- Error handling for unsupported formats

## Frontend Changes

### Studio Page (`client/src/features/courses/pages/studio-page.jsx`)
- Enhanced form with two content input modes:
  - **📝 Write Text**: Textarea for direct content entry
  - **📁 Upload File**: Drag-and-drop file upload for `.txt`/`.pdf`

### Form State
- Toggle between input modes without data loss
- File preview showing selected filename
- Validation for both text and file modes

### Styling (`client/src/styles/index.css`)
New CSS classes added:
- `.toggle-group`: Button group container
- `.toggle-btn`: Toggle button styling with active state
- `.textarea`: Styled textarea input
- `.file-input-wrapper`: File input container
- `.file-label`: Styled file picker with drag-and-drop appearance
- `.file-preview`: Shows selected file name

## Workflow

### Publishing a Book with Content

#### Option 1: Direct Text
1. Fill ISBN, Title, Author fields
2. Click "Write Text" toggle
3. Enter content in textarea
4. Click "Publish book"

#### Option 2: File Upload
1. Fill ISBN, Title, Author fields
2. Click "Upload File" toggle
3. Select `.txt` or `.pdf` file
4. Click "Publish book"
5. Frontend extracts content and uploads separately

## Dependencies
- **Backend**: `pdf-parse` (v2.4.5) - PDF text extraction
- **Frontend**: Built with existing stack (Formik, React, Axios)

## Testing
- All 15 existing tests pass with new content field
- Validators properly handle optional content parameter
- Schema changes backward compatible

## Error Handling
- Invalid file types: Clear error message
- PDF parsing failures: Fallback error message
- Missing content in file mode: Validation error
- Network errors: Standard error display

## Notes
- Content field is optional to maintain backward compatibility
- File uploads processed server-side for security
- Large PDFs may take time to parse - consider timeout handling for production
