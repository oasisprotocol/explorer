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
 * Groups of characters that should be considered equivalent during text searches.
 *
 * Currently supported languages:
 *  - German
 *  - Slovenian
 *  - Croatian
 *  - Polish
 *  - Hungarian
 */
export const diacriticEquivalenceGroups: string[][] = [
  ['aáäą', 'AÁÄĄ'],
  ['eéę', 'EÉĘ'],
  ['ií', 'IÍ'],
  ['oóöő', 'OÓÖŐ'],
  ['uúüű', 'UÚÜŰ'],
  ['cćč', 'CČĆ'],
  ['dđ', 'DĐ'],
  ['lł', 'LŁ'],
  ['sšś', 'SŠŚ'],
  ['zžźż', 'ZŽŹŻ'],
]

// ====================== Internal data tables

const caseSensitiveDiacriticNormalizationTable: Map<string, string> = new Map<string, string>()
const caseInsensitiveDiacriticNormalizationTable: Map<string, string> = new Map<string, string>()
const caseSensitiveDiacriticRegexpTable: Map<string, string> = new Map<string, string>()
const caseInsensitiveDiacriticRegexpTable: Map<string, string> = new Map<string, string>()

diacriticEquivalenceGroups.forEach(g => {
  const smallReference = g[0][0]
  const bigReference = g[1][0]
  g[0]
    .split('')
    .filter(char => char !== smallReference)
    .forEach(char => caseInsensitiveDiacriticNormalizationTable.set(char, smallReference))
  g[1]
    .split('')
    .filter(char => char.toLowerCase() !== smallReference)
    .forEach(char => caseInsensitiveDiacriticNormalizationTable.set(char, smallReference))
  g[0]
    .split('')
    .filter(char => char !== smallReference)
    .forEach(char => caseSensitiveDiacriticNormalizationTable.set(char, smallReference))
  g[1]
    .split('')
    .filter(char => char !== bigReference)
    .forEach(char => caseSensitiveDiacriticNormalizationTable.set(char, bigReference))
  g[0].split('').forEach(char => caseInsensitiveDiacriticRegexpTable.set(char, `[${g[0]}${g[1]}]`))
  g[1].split('').forEach(char => caseInsensitiveDiacriticRegexpTable.set(char, `[${g[0]}${g[1]}]`))
  g[0].split('').forEach(char => caseSensitiveDiacriticRegexpTable.set(char, `[${g[0]}]`))
  g[1].split('').forEach(char => caseSensitiveDiacriticRegexpTable.set(char, `[${g[1]}]`))
})

// -----------------------------------------

/**
 * Normalize a character for text search
 */
export const normalizeCharForSearch = (char: string, options: NormalizerOptions = {}) => {
  const { caseSensitive = false, diacriticSensitive = false } = options
  const stage1 = diacriticSensitive
    ? char
    : (caseSensitive
        ? caseSensitiveDiacriticNormalizationTable.get(char)
        : caseInsensitiveDiacriticNormalizationTable.get(char)) || char
  return caseSensitive ? stage1 : stage1.toLowerCase()
}

/**
 * A basic text normalizer function
 */
export const normalizeTextForSearch = (text: string, options: NormalizerOptions = {}) =>
  text
    .split('')
    .map(char => normalizeCharForSearch(char, options))
    .join('')
