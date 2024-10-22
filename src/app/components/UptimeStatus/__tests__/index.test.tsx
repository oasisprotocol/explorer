import { ensureTwelveElements } from '..'

describe('ensureTwelveElements', () => {
  test('fills an array with undefined values when arary has less than 12 elements', () => {
    const input = [1, 2, 3]
    const result = ensureTwelveElements(input)
    expect(result.length).toBe(12)
    expect(result).toStrictEqual([
      1,
      2,
      3,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ])
  })

  test('returns an array with the same 12 elements', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const result = ensureTwelveElements(input)
    expect(result.length).toBe(12)
    expect(result).toStrictEqual(input)
  })

  test('truncates the array if it has more than 12 elements', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    const result = ensureTwelveElements(input)
    expect(result.length).toBe(12)
    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  test('returns an array with 12 undefined values when array is empty', () => {
    const result = ensureTwelveElements([])
    expect(result.length).toBe(12)
    expect(result).toStrictEqual(new Array(12).fill(undefined))
  })

  test('returns an array with 12 undefined values when array is not provided', () => {
    const result = ensureTwelveElements()
    expect(result.length).toBe(12)
    expect(result).toStrictEqual(new Array(12).fill(undefined))
  })
})
