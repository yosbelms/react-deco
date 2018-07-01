import * as React from 'react'
import { ReactElement, createElement } from 'react'
import * as PropTypes from 'prop-types'

function isFunction(v) {
  return typeof v === 'function'
}

function defaultToNull(v: any) {
  return v === void 0 ? null : v
}

function evalTest(test: any): boolean {
  return (typeof test === 'function') ? test() : test
}

function toElement(c) {
  return isFunction(c) ? createElement(c) : defaultToNull(c)
}

/**
 * Conditionally render components based on the truthy-ness of evaluating the `test` prop.
 * Render `then` if `test` evaluates to truthy, render `else` prop otherwise.
 */
export function If({ test, then, 'else': _else }: {
  test: any,
  then: any,
  else?: any,
}) {
  return toElement(evalTest(test) ? then : _else)
}

(If as any).propTypes = {
  test: PropTypes.any.isRequired,
  then: PropTypes.any.isRequired,
  else: PropTypes.any
}

/**
 * Render the result of dispatching to the `map` method of `target`
 * passing the `map` prop as the first argument.
 */
export function Map<T>({ target, 'with': _with }: {
  target: T[],
  with: <U>(value?: T, key?: number | string, target?: U[]) => any
}): ReactElement<any> {
  return createElement(React.Fragment, null, target.map(_with))
}

(Map as any).propTypes = {
  target: PropTypes.any.isRequired,
  with: PropTypes.func.isRequired
}