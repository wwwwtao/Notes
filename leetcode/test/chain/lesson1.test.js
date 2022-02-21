import sort, { NodeList } from '../../code/chain/lesson1'

test('sort:1', () => {
  let head = new NodeList([4, 1, 3, 2, 7, 9, 10, 12, 6])
  sort(head)
  let res = []
  let next = head
  while (next) {
    res.push(next.val)
    next = next.next
  }
  expect(res).toEqual([1, 2, 3, 4, 6, 7, 9, 10, 12])
})
