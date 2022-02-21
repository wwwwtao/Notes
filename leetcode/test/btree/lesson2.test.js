import Tree, { Node } from '../../code/btree/lesson2'

test('Tree:1', () => {
  let root = new Tree([2, 1, 3])
  expect(Tree.walk(root)).toBe(true)
})

test('Tree:2', () => {
  let root = new Node(2)
  root.left = new Node(3)
  root.right = new Node(1)
  expect(Tree.walk(root)).toBe(false)
})
