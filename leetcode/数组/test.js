// // # 合并两个有序数组

// // 输入:
// nums1 = [1, 2, 3, 0, 0, 0], m = 3
// nums2 = [2, 5, 6], n = 3

// // 输出: [1, 2, 2, 3, 5, 6]

// const merge = function (nums1, m, nums2, n) {
//   let len1 = m - 1,
//     len2 = n - 1,
//     len = m + n - 1
//   while (len2 >= 0) {
//     if (len1 < 0) {
//       nums1[len--] = nums2[len2--]
//       continue
//     }
//     nums1[len--] = nums1[len1] >= nums2[len2] ? nums1[len1--] : nums2[len2--]
//   }
// };
// merge(nums1, m, nums2, n)

// # 两数之和
// 给定 nums = [2, 7, 11, 15], target = 9

// 因为 nums[0] + nums[1] = 2 + 7 = 9
// 所以返回[0, 1]


// nums = [1, 4, 2, 8, 11, 15], target = 9


// const twoSum = function (nums, target) {
//   let map = new Map()
//   for (let i = 0; i < nums.length; i++) {
//     k = target - nums[i]
//     console.log(map.has(k));
//     if (map.has(k)) {
//       return [map.get(k), i]
//     }
//     map.set(nums[i],i)
//   }
//   return []
// }
// console.log(twoSum(nums, target));


// nums = [-1, 0, 1, 2, -1, -4]

// const threeSum = function (nums) {
//   let set = new Set() // 使用 Set() 即可满足需求, 相对节省内存
//   let result = []
//   nums.sort((a, b) => (a - b))

//   for(let i =0; i < nums.length - 2; i++) {
//     while (nums[i] === nums[i - 1]) {i++} // 去重
//     // 第一个数
//     let first = nums[i]
//     let j = i + 1
//     while (j < nums.length) { // 第三个数
//       let third = nums[j]
//       let second = 0 - third - first
//       if(set.has(second)) {
//         result.push([first, second, third])
//         while (nums[j] === nums[j-1]) {j++} // 去重
//       } 
//       set.add({third})
//       j++
//     }
//     set = new Set()
//   }
//   return result
// };

// console.log(threeSum(nums));


// function quickSort(arr){
//   if(arr.length <= 1) return arr;
//   let right = [],left = [],keys = arr.shift();
//   for(let value of arr){
//       if(value > keys){
//           right.push(value)
//       }else{
//           left.push(value);
//       }
//   }
//   return quickSort(left).concat(keys,quickSort(right));
// }

// nums = [5, 6, 2, 3, 1, 15]
// console.log(quickSort(nums));
