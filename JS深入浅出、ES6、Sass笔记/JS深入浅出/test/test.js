// 原始数据：
let arr = [{
  id: 1,
  name: '部门1',
  pid: 0
},
{
  id: 2,
  name: '部门2',
  pid: 1
},
{
  id: 3,
  name: '部门3',
  pid: 1
},
{
  id: 4,
  name: '部门4',
  pid: 3
},
{
  id: 5,
  name: '部门5',
  pid: 4
},
]

// 优雅引用
function toTreeTwo(list = []) {
const map = list.reduce((prev, next) => ({
  ...prev,
  [next.id]: next
}), {})
const routers = list.filter(item => {
  const parent = map[item.pid]
  if (parent) {
      if (parent.children) {
          parent.children.push(item)
      } else {
          parent.children = [item]
      }
      return false
  }
  return item
})
console.log(routers);
return routers
}

console.log(toTreeTwo(arr));