import sanitizeHtmlLib from 'sanitize-html'

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'a',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'img',
  'span',
  'div',
  'section',
  'article',
]

/**
 * Sanitize HTML for blog content (dangerouslySetInnerHTML).
 * Uses `sanitize-html` (htmlparser2) — reliable on Vercel serverless.
 * `isomorphic-dompurify` depends on JSDOM and often breaks in serverless.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''
  try {
    return sanitizeHtmlLib(html, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: {
        '*': ['class'],
        a: ['href', 'target', 'rel', 'class'],
        img: ['src', 'alt', 'class'],
      },
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      allowedSchemesByTag: {
        img: ['http', 'https'],
      },
      allowProtocolRelative: false,
    })
  } catch {
    return ''
  }
}
