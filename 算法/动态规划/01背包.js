/* 0-1 背包：动态规划 */
function knapsackDP(wgt, val, cap) {
  const n = wgt.length;
  // 初始化 dp 表
  const dp = Array(n + 1)
    .fill(0)
    .map(() => Array(cap + 1).fill(0));
  // 状态转移
  for (let i = 1; i <= n; i++) {
    for (let c = 1; c <= cap; c++) {
      if (wgt[i - 1] > c) {
        // 若超过背包容量，则不选物品 i
        dp[i][c] = dp[i - 1][c];
      } else {
        // 不选和选物品 i 这两种方案的较大值
        dp[i][c] = Math.max(
          dp[i - 1][c],
          dp[i - 1][c - wgt[i - 1]] + val[i - 1]
        );
      }
    }
  }
  return dp[n][cap];
}

const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
const capacity = 8;

const maxValue = knapsackDP(weights, values, capacity);
console.log("背包能装下的最大价值为: ", maxValue);

/* 0-1 背包：状态压缩后的动态规划 */
function knapsackDPComp(wgt, val, cap) {
  const n = wgt.length;
  // 初始化 dp 表
  const dp = Array(cap + 1).fill(0);
  // 状态转移
  for (let i = 1; i <= n; i++) {
    // 倒序遍历
    for (let c = cap; c >= 1; c--) {
      if (wgt[i - 1] <= c) {
        // 不选和选物品 i 这两种方案的较大值
        dp[c] = Math.max(dp[c], dp[c - wgt[i - 1]] + val[i - 1]);
      }
    }
  }
  return dp[cap];
}
