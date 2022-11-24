import defineReactive from './defineReactive'

export default class Observer {
  constructor(value) {
    this.value = value
    this.walk()
  }
  walk() {
    Object.keys(this.value).forEach((key) => defineReactive(this.value, key))
  }
}
