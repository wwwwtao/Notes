import Observer from './Observer'

export default function observe(value) {
  if (typeof value !== 'object') return
  let ob
  if (value.__ob__ && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}
