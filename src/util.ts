
const hasOwn = Object.prototype.hasOwnProperty

export function isFunction(v: any) {
  return typeof v === 'function'
}

export function defaultToNull(v: any) {
  return v === void 0 ? null : v
}

export function toBoolean(v) {
  return Boolean(isFunction(v) ? v() : v)
}

export function toElement(c, data = void 0) {
  return defaultToNull(isFunction(c) ? c(data) : c)
}

function is(x: any, y: any): boolean {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export function shallowEqual(objA: any, objB: any): boolean {
  if (is(objA, objB)) {
    return true
  }

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}