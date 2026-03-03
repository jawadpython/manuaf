import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS when rendering with dangerouslySetInnerHTML.
 * Allows safe tags (p, h1-h6, ul, ol, li, a, strong, em, br, blockquote, etc.)
 * and strips scripts, iframes, event handlers, and javascript: URLs.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img',
      'span', 'div', 'section', 'article',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class'],
    ALLOW_DATA_ATTR: false,
  })
}
