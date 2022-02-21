import buy from '../../code/greed/lesson1'

test('buy:1', () => {
  expect(buy([7, 1, 5, 3, 6, 4])).toBe(7)
})
test('buy:2', () => {
  expect(buy([1, 2, 3, 4, 5])).toBe(4)
})
test('buy:3', () => {
  expect(buy([7, 6, 4, 3, 1])).toBe(0)
})
