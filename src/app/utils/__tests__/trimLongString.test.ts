import { trimLongString } from '../trimLongString'

describe('trimLongString', () => {
  it('should return trimmed string', () => {
    expect(trimLongString('oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4')).toEqual('oasis1…0d5eq4')
    expect(trimLongString('oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4', 2, 2)).toEqual('oa…q4')
  })

  it('it should not return a "trimmed" version that is actually longer than the original, even if longer than trimStart', () => {
    expect(trimLongString('unavailable')).toEqual('unavailable')
  })
})
