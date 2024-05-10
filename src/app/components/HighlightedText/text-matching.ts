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
 * NOTE: depending on normalization options, the string length can change,
 * and in that case, match position can be incorrect.
 */
export const findTextMatch = (
  rawCorpus: string | null | undefined,
  search: (string | undefined)[],
  options: NormalizerOptions = {},
): MatchInfo => {
  const normalizedCorpus = normalizeTextForSearch(rawCorpus || '', options)
  const matches: PositiveMatchInfo[] = search
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
  return matches[0] ?? NO_MATCH
}

/**
 * Check if a pattern matches within a corpus, also considering normalization
 *
 * NOTE: depending on normalization options, the string length can change,
 * and in that case, match position can be incorrect.
 */
export const hasTextMatch = (
  rawCorpus: string | null | undefined,
  search: (string | undefined)[],
  options: NormalizerOptions = {},
): boolean => findTextMatch(rawCorpus, search, options) !== NO_MATCH
