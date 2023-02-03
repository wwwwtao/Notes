import Observer from './Observer'

export default function observe(data) {
  if (typeof data !== 'object') return
  new Observer(data)
}
