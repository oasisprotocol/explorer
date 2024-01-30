/**
 * Options for doing text search
 */
export interface NormalizerOptions {
  /**
   * Should we search in a case-sensitive way?
   *
   * (Defaults to false.)
   */
  caseSensitive?: boolean

  /**
   * Should we do a diacritic sensitive search?
   *
   * (Defaults to false.)
   */
  diacriticSensitive?: boolean
}

/**
 * A basic text normalizer function
 */
export const normalizeTextForSearch = (text: string, options: NormalizerOptions = {}) => {
  const { caseSensitive = false, diacriticSensitive = false } = options
  const stage1 = diacriticSensitive ? text : text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return caseSensitive ? stage1 : stage1.toLowerCase()
}
