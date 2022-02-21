import matrix from '../../code/matrix/lesson1'

test('matrix', () => {
  let input = [
    [ 1, 2, 3 ],
    [ 4, 5, 6 ],
    [ 7, 8, 9 ]
  ]
  expect(matrix(input)).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5])
  expect(matrix([[7], [9], [6]])).toEqual([7, 9, 6])
  expect(matrix([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
})
