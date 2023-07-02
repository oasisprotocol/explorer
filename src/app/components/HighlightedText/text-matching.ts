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

export interface CutAroundOptions extends NormalizerOptions {
  /**
   * What should be the length of the fragment delivered, which
   * has the pattern inside it?
   *
   * The default value is 80.
   */
  fragmentLength?: number
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
  const { fragmentLength = 80, ...matchOptions } = options

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
