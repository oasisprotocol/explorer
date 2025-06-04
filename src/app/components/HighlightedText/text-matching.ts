import { NormalizerOptions, normalizeTextForSearch } from './text-normalization'
export type { NormalizerOptions } from './text-normalization'

/**
 * Store info about where did we found the pattern inside the corpus
 */
export interface PositiveMatchInfo {
  startPos: number
  endPos: number
}

export const NO_MATCH = 'NO_MATCH'

export type MatchInfo = PositiveMatchInfo | typeof NO_MATCH

/**
 * Identify pattern matches within a corpus, also considering normalization
 *
 * If there is no match, an empty array is returned.
 *
 * NOTE: depending on normalization options, the string length can change,
 * and in that case, match position can be incorrect.
 */
export const findTextMatches = (
  rawCorpus: string | null | undefined,
  pattern: (string | undefined)[],
  options: NormalizerOptions = {},
): PositiveMatchInfo[] => {
  const normalizedCorpus = normalizeTextForSearch(rawCorpus || '', options)
  const matches: PositiveMatchInfo[] = pattern
    .filter((s): s is string => !!s)
    .map(rawPattern => {
      const normalizedPattern = normalizeTextForSearch(rawPattern!, options)
      const matchStart = normalizedCorpus.indexOf(normalizedPattern)
      return matchStart !== -1
        ? {
            startPos: matchStart,
            endPos: matchStart + rawPattern.length,
          }
        : 'NO_MATCH'
    })
    .filter((m): m is PositiveMatchInfo => m !== NO_MATCH)
  return matches
}

/**
 * Identify the first pattern match within a corpus, also considering normalization
 *
 * If there is no match, NO_MATCH is returned.
 *
 * NOTE: depending on normalization options, the string length can change,
 * and in that case, match position can be incorrect.
 */
export const findTextMatch = (
  rawCorpus: string | null | undefined,
  search: (string | undefined)[],
  options: NormalizerOptions = {},
): MatchInfo => {
  const matches = findTextMatches(rawCorpus, search, options)
  return matches[0] ?? NO_MATCH
}

/**
 * Check if all patterns match within a corpus, also considering normalization
 *
 * NOTE: depending on normalization options, the string length can change,
 * and in that case, match position can be incorrect.
 *
 * Also NOTE: if there are no patterns given, the result will be true.
 *
 */
export const hasTextMatchesForAll = (
  rawCorpus: string | null | undefined,
  patterns: (string | undefined)[],
  options: NormalizerOptions = {},
): boolean =>
  patterns
    .filter(pattern => !!pattern)
    .every(pattern => findTextMatch(rawCorpus, [pattern], options) !== NO_MATCH)
