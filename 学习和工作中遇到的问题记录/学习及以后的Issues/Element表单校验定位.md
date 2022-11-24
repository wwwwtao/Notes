```js
import Vue from "vue";
import { Message } from "element-ui";

export const firstErrorInputFocus = () => {
  setTimeout(() => {
    //获取当前必录的校验词并弹框提示输入具体必录项
    if (document.getElementsByClassName("el-form-item__error").length > 0) {
      Message.warning(document.getElementsByClassName("el-form-item__error")[0].innerText);
    }
    let isError = document.getElementsByClassName("is-error");
    if (isError?.length) {
      let isErrorInput = isError[0].querySelector("input");

      let isErrortextarea = isError[0].querySelector(".el-textarea__inner");

      if (isErrorInput) {
        isErrorInput.focus();
      }

      if (isErrortextarea) {
        isErrortextarea.focus();
      }
    }
  }, 100);
};

Vue.prototype.$firstErrorInputFocus = firstErrorInputFocus;
```