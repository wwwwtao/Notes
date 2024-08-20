```js
mounted() {
  this.scrollAF();
  (this.$refs.scrollbar as any).wrap.addEventListener("mouseenter", this.pauseScroll);
  (this.$refs.scrollbar as any).wrap.addEventListener("mouseleave", this.resumeScroll);
}
destroyed() {
  (this.$refs.scrollbar as any).wrap.removeEventListener("mouseenter", this.pauseScroll);
  (this.$refs.scrollbar as any).wrap.removeEventListener("mouseleave", this.resumeScroll);
}



isPaused = false;
pauseScroll() {
  this.isPaused = true;
}
resumeScroll() {
  this.isPaused = false;
}
scrollAF() {
  const animateScroll = () => {
    const el = (this.$refs.scrollbar as any).wrap;
    const scrollHeight = el.scrollHeight - el.clientHeight; // 列表的滚动高度
    const scrollStep = 1; // 每次滚动的步长
    let currentScroll = el.scrollTop;
    if (!this.isPaused) {
      currentScroll += scrollStep;
      if (currentScroll >= scrollHeight) {
        currentScroll = 0; // 列表滚动到底部时回到顶部
      }
      el.scrollTop = currentScroll;
    }
    window.requestAnimationFrame(animateScroll);
  };
  window.requestAnimationFrame(animateScroll);
}
```
