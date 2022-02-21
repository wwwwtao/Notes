import change from '../../code/greed/lesson2'

test('change:1', () => {
  expect(change([5, 5, 5, 10, 20])).toBe(true)
})
test('change:2', () => {
  expect(change([5, 5, 10])).toBe(true)
})
test('change:3', () => {
  expect(change([10, 10])).toBe(false)
})
test('change:4', () => {
  expect(change([5, 5, 10, 10, 20])).toBe(false)
})
