// 信任问题

// 第三方的某个库
function method(cb) {
  // 未按所想的预期执行回调
  setTimeout(function() {
    // 讲道理应该是现在该调用回调了
    cb && cb();
    // 但是?? 好像这个库有bug啊 emm 被多调用了一次
    cb && cb();
  }, 1000);
}

// promise一但被确定为成功或者失败 就不能再被更改

function method() {
  return new Promise(resolve => {
    setTimeout(function() {
      // 成功
      resolve();
      resolve();
    }, 1000);
  });
}


// 控制反转

function method(cb) {
  // 未按所想的预期执行回调
  setTimeout(function() {
    // 执行回调 但是添油加醋
    cb && cb.call({a: 1, b: 2});
  }, 1000);
}

function method(cb) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(); // 调用的resolve全为自己所写书写的流程 很大程度上改善了反转控制的问题
    }, 1000);
  });
}
