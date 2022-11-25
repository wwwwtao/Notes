// # 判断一个单链表是否有环
// https://www.pzijun.cn/algorithms/list/3.html#%E8%A7%A3%E6%B3%95%E4%B8%80%EF%BC%9A%E6%A0%87%E5%BF%97%E6%B3%95


// 解法二：利用 JSON.stringify() 不能序列化含有循环引用的结构
// const hasCycle = function(head) {
//     try{
//         JSON.stringify(head);
//         return false;
//     }
//     catch(err){
//         return true;
//     }
// };
// 时间复杂度：O(n)
// 空间复杂度：O(n)


// 解法三：快慢指针（双指针法）
// 设置快慢两个指针，遍历单链表，快指针一次走两步，慢指针一次走一步，如果单链表中存在环，则快慢指针终会指向同一个节点，否则直到快指针指向 null 时，快慢指针都不可能相遇

// const hasCycle = function(head) {
//     if(!head || !head.next) {
//         return false
//     }
//     let fast = head.next.next, slow = head.next
//     while(fast !== slow) {
//         if(!fast || !fast.next) return false
//         fast = fast.next.next
//         slow = slow.next
//     }
//     return true
// };
// 时间复杂度：O(n)
// 空间复杂度：O(1)

