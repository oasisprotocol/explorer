import { findTextMatch, NormalizerOptions } from './text-matching'

export interface TrimAroundOptions extends NormalizerOptions {
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
 * If the corpus is undefined or empty, undefined is returned.
 *
 * If either the pattern is undefined or empty, or there is no match,
 * an adequately sized part from the beginning of the corpus is returned.
 *
 * If there is a match, but the corpus is at most as long as the desired fragment length,
 * the whole corpus is returned.
 *
 * If there is a match, and the corpus is longer than the desired fragment length,
 * then a part of a corpus is returned, so that the match is within the returned part,
 * around the middle.
 */
export function trimAroundMatch(
  corpus: string | undefined,
  pattern: string | undefined,
  options: TrimAroundOptions = {},
): string | undefined {
  const { fragmentLength = 80, ...matchOptions } = options

  if (!corpus) {
    // there is nothing to see here
    return undefined
  }

  // do we have a match?
  const match = pattern ? findTextMatch(corpus, [pattern], matchOptions) : undefined

  if (corpus.length <= fragmentLength) {
    // the whole corpus fits into the max size, no need to cut.
    return corpus
  }

  // how much extra space do we have?
  const buffer = fragmentLength - (pattern || '').length

  const matchStart = match?.startPos ?? 0

  // We will start before the start of the match, by buffer / 2 chars
  const startPos = Math.max(Math.min(matchStart - Math.floor(buffer / 2), corpus.length - fragmentLength), 0)
  const endPos = Math.min(startPos + fragmentLength, corpus.length)

  // compile the result
  return (startPos ? '…' : '') + corpus.substring(startPos, endPos) + (endPos < corpus.length - 1 ? '…' : '')
}
