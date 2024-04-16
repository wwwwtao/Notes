/* 完全背包：动态规划 */
function unboundedKnapsackDP(wgt, val, cap) {
  const n = wgt.length;
  // 初始化 dp 表
  const dp = Array.from({ length: n + 1 }, () =>
    Array.from({ length: cap + 1 }, () => 0)
  );
  // 状态转移
  for (let i = 1; i <= n; i++) {
    for (let c = 1; c <= cap; c++) {
      if (wgt[i - 1] > c) {
        // 若超过背包容量，则不选物品 i
        dp[i][c] = dp[i - 1][c];
      } else {
        // 不选和选物品 i 这两种方案的较大值
        dp[i][c] = Math.max(dp[i - 1][c], dp[i][c - wgt[i - 1]] + val[i - 1]);
      }
    }
  }
  return dp[n][cap];
}

// 调用函数
let val = [60, 100, 120];
let wt = [10, 20, 30];
let W = 50;


/* 完全背包：状态压缩后的动态规划 */
function unboundedKnapsackDPComp(wgt, val, cap) {
  const n = wgt.length;
  // 初始化 dp 表
  const dp = Array.from({ length: cap + 1 }, () => 0);
  // 状态转移
  for (let i = 1; i <= n; i++) {
    for (let c = 1; c <= cap; c++) {
      if (wgt[i - 1] > c) {
        // 若超过背包容量，则不选物品 i
        dp[c] = dp[c];
      } else {
        // 不选和选物品 i 这两种方案的较大值
        dp[c] = Math.max(dp[c], dp[c - wgt[i - 1]] + val[i - 1]);
      }
    }
  }
  return dp[cap];
}
