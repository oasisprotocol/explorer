import { NormalizerOptions, normalizeTextForSearch } from './text-normalization'
export type { NormalizerOptions } from './text-normalization'

/**
 * Store info about where did we found the pattern inside the corpus
 */
export interface MatchInfo {
  searchText: string
  startPos: number
}

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
  const matches: MatchInfo[] = search
    .filter((s): s is string => !!s)
    .map(rawPattern => {
      const normalizedPattern = normalizeTextForSearch(rawPattern!, options)
      const matchStart = normalizedCorpus.indexOf(normalizedPattern)
      return matchStart !== -1
        ? {
            searchText: rawPattern,
            startPos: matchStart,
          }
        : undefined
    })
    .filter((m): m is MatchInfo => !!m)
  return matches[0]
}
