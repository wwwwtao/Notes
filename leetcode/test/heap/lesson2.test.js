import Ugly from '../../code/heap/lesson2'

test('ugly:1', () => {
  expect(Ugly.getPrimes(6)).toEqual([2, 3])
  expect(Ugly.getPrimes(4)).toEqual([2])
  expect(Ugly.getPrimes(180)).toEqual([2, 3, 5])
})

test('ugly:2', () => {
  let ugly = new Ugly(12, [2, 7, 13, 19])
  expect(ugly.getAll()).toBe(32)
})
