// export default (arr, n) => {
//   // 计数器
//   let max = 0
//   // 右边界补充[0,0,0],最后一块地能不能种只取决于前面的是不是1，所以默认最后一块地的右侧是0（无须考虑右侧边界有阻碍）（LeetCode测试用例）
//   arr.push(0)
//   for (let i = 0, len = arr.length - 1; i < len; i++) {
//     if (arr[i] === 0) {
//       if (i === 0 && arr[1] === 0) {
//         max++
//         i++
//       } else if (arr[i - 1] === 0 && arr[i + 1] === 0) {
//         max++
//         i++
//       }
//     }
//   }
//   return max >= n
// }

// 种花问题
// 可供断点调试的代码⬇️ 需要注释掉上面的代码

// 数学归纳法,很简单推出来
// 统计连续的0的区间,分别有多少个连续的0即可。对于每一段0区间,都可以根据公式直接算出可以种几朵花。
// 公式可以通过数学归纳法推出来,很简单:

// 1)对于中间的0区间:
// 1~2个0:可种0朵;
// 3~4个:可种1朵;
// 5~6个:可种2朵;
// ...
// count个:可种 (count-1)/2 朵

// 2)对于两头的0区间,由于左边、右边分别没有1的限制,可种花朵数稍有不同。
// 为了代码流程的统一,可以在数组最左边、数组最右边分别补1个0,意味着花坛左边、右边没有花。
// 这样公式就跟1)相同了。

var test = function(arr) {
  // 1. 前后补0
  arr.unshift(0)
  // arr.push(0)

  let canPlace = 0 // 能种的数量
  let countOfZero = 0 // 区间0的数量
  arr.forEach((item,index) => {
    if(item === 0){
      countOfZero++
    }else {
      canPlace += parseInt((countOfZero-1)/2)
      countOfZero = 0
    }
  });
  // 最后一段0区还未结算：
  countOfZero++; // 最后再预设1个0，因为最后花坛的最右边没有花，可以认为存在一个虚无的0
  canPlace += parseInt((countOfZero-1)/2)


  return canPlace
}

test([0,0,1,0,0,0,0,1,1,0,0,1,0,0,0,0,0,1])
