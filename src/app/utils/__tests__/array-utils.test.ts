import { ArrayUtils } from '../array-utils'

describe('ArrayUtils', () => {
  describe('replaceOrAppend', () => {
    it('should append new item if list is empty', () => {
      const emptyList: number[] = []
      const newItem = 1
      const result = ArrayUtils.replaceOrAppend(emptyList, newItem, (a, b) => a === b)

      expect(result).toEqual([newItem])
    })

    it('should replace existing item if match found', () => {
      const list = [
        { a: 1, b: 2 },
        { a: 2, b: 3 },
        { a: 3, b: 4 },
      ]
      const newItem = { a: 2, b: 100 }
      const result = ArrayUtils.replaceOrAppend(list, newItem, ({ a: a1 }, { a: a2 }) => a1 === a2)

      expect(result).toEqual([{ a: 1, b: 2 }, newItem, { a: 3, b: 4 }])
    })

    it('should append new item if no match found', () => {
      const list = [1, 2, 3]
      const newItem = 4
      const result = ArrayUtils.replaceOrAppend(list, newItem, (a, b) => a === b)

      expect(result).toEqual([...list, newItem])
    })
  })
})
