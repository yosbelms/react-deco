import * as PropTypes from 'prop-types';
import * as React from 'react';
import { createElement, ReactElement } from 'react';
import { shallowEqual } from './util';

export interface Mapper<T> {
  <U>(value: T): U
  <U>(value: T, key: number): U
  <U>(value: T, key: number, target: T[]): U
}

function isFunction(v) {
  return typeof v === 'function'
}

function defaultToNull(v: any) {
  return v === void 0 ? null : v
}

function toElement(c, data = void 0) {
  return defaultToNull(isFunction(c) ? c(data) : c)
}

function toBoolean(v) {
  return Boolean(isFunction(v) ? v() : v)
}

function shallowDifferent(prev, next) {
  let different
  if (isArray(next) && isArray(prev)) {
    different = next.reduce((shd, a, idx) =>
      shd || !shallowEqual(a, prev[idx] as any[]), false)
  } else {
    different = !shallowEqual(prev, next)
  }
  return different
}

function prependArg(fn, arg) {
  return (...args) => fn(arg, ...args)
}

const isArray = Array.isArray

/**
 * Conditionally render components based on the truthy-ness of evaluating the `test` prop.
 * Render `then` if `test` evaluates to truthy, render `else` otherwise.
 */
export function If({ test, then, 'else': _else }: {
  test: any,
  then: any,
  else?: any,
}) {
  return toElement(test ? then : _else)
}

(If as any).propTypes = {
  test: PropTypes.any,
  then: PropTypes.any.isRequired,
  else: PropTypes.any
}

/**
 * Render the first `When` child whose`test` prop evaluates to true.
 */
export function Switch({ children }: { children: any }) {
  let choice

  React.Children.forEach(children, child => {
    if (
      choice === void 0 &&
      React.isValidElement(child) &&
      (child.type as any).isWhen &&
      toBoolean((child.props as any).test)
    ) {
      choice = child
    }
  })

  return toElement(choice ? choice.props.render : null)
}

export function When(_: {
  test: any
  render: () => any
}) {
  return null
}

(When as any).isWhen = true;

(When as any).propTypes = {
  test: PropTypes.any,
  render: PropTypes.any.isRequired
}

/**
 * Render the result of dispatching to the `map` method of `target`
 * passing the `with` function as the first argument.
 */
export function Map<T>({ target, 'with': _with }: {
  target: T[],
  with: Mapper<T>
}): ReactElement<any> {
  return createElement(React.Fragment, null, target.map(_with))
}

(Map as any).propTypes = {
  target: PropTypes.any.isRequired,
  with: PropTypes.func.isRequired
}

/**
 * A component that its `constructor`, `shouldComponentUpdate`, and lifecycle methods
 * can be assigned via props
 */
export class Bare extends React.Component<{
  render: any
  constructor?: Function,
  pureBy?: any
  didCatch?: (...args: any[]) => any
  didMount?: (...args: any[]) => any
  didUpdate?: (...args: any[]) => any
  shouldUpdate?: (...args: any[]) => any
  willUnmount?: (...args: any[]) => any
}> {

  previousPuritySource: any = null

  constructor(props, ctx) {
    super(props, ctx)
    const {
      constructor,
      pureBy,
      didCatch,
      didMount,
      didUpdate,
      shouldUpdate,
      willUnmount
    } = props

    if (isFunction(constructor)) {
      constructor(this, props, ctx)
    }

    if (isFunction(didCatch)) {
      this.componentDidCatch = prependArg(didCatch, this)
    }

    if (isFunction(didMount)) {
      this.componentDidMount = prependArg(didMount, this)
    }

    if (isFunction(didUpdate)) {
      this.componentDidUpdate = prependArg(didUpdate, this)
    }

    if (pureBy !== void 0) {
      if (shouldUpdate !== void 0) {
        throw new Error('You can only use either `shouldUpdate`, or `pureBy` prop in Bare components')
      }

      this.previousPuritySource = pureBy
      this.shouldComponentUpdate = function shouldComponentUpdate(nextProps, _) {
        const nextPuritySource = nextProps.pureBy
        const previousPuritySource = this.previousPuritySource
        const should = shallowDifferent(nextPuritySource, previousPuritySource)

        if (should) {
          this.previousPuritySource = nextPuritySource
        }

        return should
      }
    } else if (isFunction(shouldUpdate)) {
      this.shouldComponentUpdate = prependArg(shouldUpdate, this)
    }

    if (isFunction(willUnmount)) {
      this.componentWillUnmount = prependArg(willUnmount, this)
    }
  }

  render() {
    return toElement(this.props.render, this)
  }
}

(Bare as any).propTypes = {
  render: PropTypes.any.isRequired,
  constructor: PropTypes.func,
  pureBy: PropTypes.any,
  didCatch: PropTypes.func,
  didMount: PropTypes.func,
  didUpdate: PropTypes.func,
  shouldUpdate: PropTypes.func,
  willUnmount: PropTypes.func
}