/**
 * Store info about where did we found the pattern inside the corpus
 */
export interface MatchInfo {
  searchText: string
  startPos: number
}

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
 * Currently, supports German and Hungarian languages.
 */
export const diacriticEquivalenceGroups: string[][] = [
  ['aáä', 'AÁÄ'],
  ['eé', 'EÉ'],
  ['ií', 'IÍ'],
  ['oóöő', 'OÓÖŐ'],
  ['uúüű', 'UÚÜŰ'],
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
 * Determine whether a simple character is alphanumerical or not
 */
export const isCharAlphaNumerical = (char: string): boolean => {
  const code = char.charCodeAt(0)
  return (
    (code > 47 && code < 58) || // numeric (0-9)
    (code > 64 && code < 91) || // upper alpha (A-Z)
    (code > 96 && code < 123)
  ) // lower alpha (a-z)
}

/**
 * Escape a character to be used in a regexp-based text search, also considering normalization
 */
export const escapeCharForPCRE = (char: string, options: NormalizerOptions) => {
  const { diacriticSensitive = false, caseSensitive = false } = options
  if (diacriticSensitive) {
    if (isCharAlphaNumerical(char) || caseInsensitiveDiacriticNormalizationTable.has(char)) {
      // TODO: test if we need to manually do case-insensitive in this case
      return char
    } else {
      return `\\${char}`
    }
  } else {
    const mapping = caseSensitive
      ? caseSensitiveDiacriticRegexpTable.get(char)
      : caseInsensitiveDiacriticRegexpTable.get(char)
    return mapping || (isCharAlphaNumerical(char) ? char : `\\${char}`)
  }
}

/**
 * Escape a string so that it becomes a valid PCRE regexp, also considering normalization
 *
 * (I.e. escape all the non-alphanumerical characters.)
 */
export const escapeTextForPCRE = (input: string, options: NormalizerOptions = {}) =>
  input
    .split('')
    .map(char => escapeCharForPCRE(char, options))
    .join('')

/**
 * Prepare a Mongo Query expression for doing a text search, also considering normalization
 */
export const getMongoRegexpSearch = (pattern: string, options: NormalizerOptions = {}) => {
  const { caseSensitive = false } = options
  return {
    $regex: escapeTextForPCRE(pattern, options),
    $options: caseSensitive ? 'm' : 'im',
  }
}

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
  const stage2 = caseSensitive ? stage1 : stage1.toLowerCase()
  return stage2
}

/**
 * A basic text normalizer function
 */
export const normalizeTextForSearch = (text: string, options: NormalizerOptions = {}) =>
  text
    .split('')
    .map(char => normalizeCharForSearch(char, options))
    .join('')

/**
 * Identify pattern matches within a corpus, also considering normalization
 */
export const findTextMatch = (
  rawCorpus: string | null | undefined,
  search: (string | undefined)[],
  options: NormalizerOptions = {},
): MatchInfo => {
  let matchStart: number
  let normalizedPattern: string
  const normalizedCorpus = normalizeTextForSearch(rawCorpus || '', options)
  const matches: MatchInfo[] = search
    .filter(s => !!s && s.toLowerCase)
    .map(rawPattern => {
      normalizedPattern = normalizeTextForSearch(rawPattern!, options)
      // console.log(`Will search for "${normalizedPattern}" in "${normalizedCorpus}"...`);
      matchStart = normalizedCorpus.indexOf(normalizedPattern)
      return matchStart !== -1
        ? {
            searchText: rawPattern,
            startPos: matchStart,
          }
        : undefined
    })
    .filter(m => !!m)
    .map(m => m as MatchInfo) // This last line is only here to make TS happy
  return matches[0]
}

export interface CutAroundOptions extends NormalizerOptions {
  /**
   * What should be the length of the fragment delivered, which
   * has the pattern inside it?
   *
   * The default value is 80.
   */
  fragmentLength?: number

  debug?: boolean
}

/**
 * Return a part of the corpus that contains the match to the pattern, if any
 *
 * If either the corpus or the pattern is undefined or empty, undefined is returned.
 * If there is no match, undefined is returned.
 *
 * If there is a match, but the corpus is at most as long as the desired fragment length,
 * the whole corpus is returned.
 *
 * If there is a match, and the corpus is longer than the desired fragment length,
 * then a part of a corpus is returned, so that the match is within the returned part,
 * around the middle.
 */
export function cutAroundMatch(
  corpus: string | undefined,
  pattern: string | undefined,
  options: CutAroundOptions = {},
): string | undefined {
  const { fragmentLength = 80, debug, ...matchOptions } = options

  if (!corpus || !pattern) {
    // there is nothing to see here
    return
  }

  // do we have a match?
  const match = findTextMatch(corpus, [pattern], matchOptions)

  if (!match) {
    // no match, no fragment
    return
  }

  if (corpus.length <= fragmentLength) {
    // the whole corpus fits into the max size, no need to cut.
    return corpus
  }

  // how much extra space do we have?
  const buffer = fragmentLength - pattern.length

  // We will start before the start of the match, by buffer / 2 chars
  const startPos = Math.max(
    Math.min(match.startPos - Math.floor(buffer / 2), corpus.length - fragmentLength),
    0,
  )
  const endPos = Math.min(startPos + fragmentLength, corpus.length)

  // compile the result
  const result =
    (startPos ? '…' : '') + corpus.substring(startPos, endPos) + (endPos < corpus.length - 1 ? '…' : '')

  return result
}
