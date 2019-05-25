function f(val) {
  return new Promise((resolve, reject) => {
    if (val) {
      resolve({ name: '小明' });
    } else {
      reject('404');
    }
  }); 
}

// then(resolve, reject)
// then方法中的第二个回调 失败时候做的事

// f(false)
//   .then((data) => {
//     console.log(data)
//   }, e => {
//     console.log(e);
//   })

//----------------------------------------
// catch
// 使用实例的catch方法 可以捕获错误

// f(true)
//   .then(data => {
//     console.log(data);
//     return f(false);
//   })
//   .then(() => {
//     console.log('我永远不会被输出');
//   })
//   .then(() => {

//   })
//   .catch(e => {
//     console.log(e);
//     return f(false) ;
//   });

//----------------------------------------
// finally
// 不论成功还是失败 finally中的内容一定会执行

f(true)
  .then(data => {
    console.log(data);
    return f(false);
  })
  .catch(e => {
    console.log(e);
    return f(false);
  })
  .finally(() => {
    console.log(100);
  });
