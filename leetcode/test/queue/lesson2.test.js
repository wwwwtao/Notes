import cpu from '../../code/queue/lesson2'

test('cpu:1', () => {
  let tasks = ['A', 'A', 'A', 'B', 'B', 'B']
  let n = 2
  expect(cpu(tasks, n)).toBe(8)
})
