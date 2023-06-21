import { formatDistanceToNow } from '../dateFormatter'

describe('formatDistanceToNow', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-01T01:01:01Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should format future dates', () => {
    expect([
      formatDistanceToNow(new Date('2023-01-01T01:01:01Z')),
      formatDistanceToNow(new Date('2023-01-01T01:01:21Z')),
      formatDistanceToNow(new Date('2023-01-01T01:21:21Z')),
      formatDistanceToNow(new Date('2023-01-01T02:01:01Z')),
      formatDistanceToNow(new Date('2023-01-02T01:01:01Z')),
      formatDistanceToNow(new Date('2023-02-01T01:01:01Z')),
      formatDistanceToNow(new Date('2024-01-01T01:01:01Z')),
      formatDistanceToNow(new Date('2023-08-23T12:20:56Z')),
    ]).toMatchSnapshot()
  })

  it('should format past dates', () => {
    expect([
      formatDistanceToNow(new Date('2023-01-01T01:01:01Z')),
      formatDistanceToNow(new Date('2023-01-01T01:00:41Z')),
      formatDistanceToNow(new Date('2023-01-01T00:41:01Z')),
      formatDistanceToNow(new Date('2023-01-01T00:01:01Z')),
      formatDistanceToNow(new Date('2022-12-31T01:01:01Z')),
      formatDistanceToNow(new Date('2022-12-01T01:01:01Z')),
      formatDistanceToNow(new Date('2022-01-01T01:01:01Z')),
      formatDistanceToNow(new Date('2022-04-23T12:20:56Z')),
    ]).toMatchSnapshot()
  })
})
