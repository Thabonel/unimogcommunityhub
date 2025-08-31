/**
 * Phantom Article Blocker
 * Prevents specific phantom articles from appearing anywhere in the app
 */

// Blacklisted article titles that should never appear
const PHANTOM_ARTICLES_BLACKLIST = [
  'Insurance and Registration Guide for Unimogs in Australia',
  'insurance and registration guide for unimogs in australia',
  'INSURANCE AND REGISTRATION GUIDE FOR UNIMOGS IN AUSTRALIA'
];

// Blacklisted content patterns
const PHANTOM_CONTENT_PATTERNS = [
  /insurance.*registration.*guide.*unimogs.*australia/i,
  /comprehensive.*guide.*navigating.*challenges.*insuring.*registering.*unimogs.*australia/i
];

/**
 * Filters out phantom articles from any array of articles
 */
export function filterPhantomArticles<T extends { title?: string; content?: string }>(articles: T[]): T[] {
  return articles.filter(article => {
    // Check title blacklist
    if (article.title && PHANTOM_ARTICLES_BLACKLIST.some(phantom => 
      article.title!.toLowerCase().includes(phantom.toLowerCase())
    )) {
      console.warn('🚫 Blocked phantom article by title:', article.title);
      return false;
    }

    // Check content patterns
    if (article.content && PHANTOM_CONTENT_PATTERNS.some(pattern => 
      pattern.test(article.content!)
    )) {
      console.warn('🚫 Blocked phantom article by content pattern');
      return false;
    }

    return true;
  });
}

/**
 * Checks if a title is a phantom article
 */
export function isPhantomArticle(title: string): boolean {
  return PHANTOM_ARTICLES_BLACKLIST.some(phantom => 
    title.toLowerCase().includes(phantom.toLowerCase())
  );
}

/**
 * Sanitizes article data to prevent phantom articles
 */
export function sanitizeArticleData<T extends { title?: string; content?: string }>(article: T): T | null {
  if (isPhantomArticle(article.title || '')) {
    console.warn('🚫 Rejected phantom article:', article.title);
    return null;
  }

  if (article.content && PHANTOM_CONTENT_PATTERNS.some(pattern => 
    pattern.test(article.content!)
  )) {
    console.warn('🚫 Rejected phantom article by content');
    return null;
  }

  return article;
}