import { sum } from '@/a'

it('Should sum 1 + 1 = 2', () => {
  const result = sum(1, 1)
  expect(result).toBe(2)
})
