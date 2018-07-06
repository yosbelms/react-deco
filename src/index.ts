import * as React from 'react'
import { ReactElement, createElement } from 'react'
import * as PropTypes from 'prop-types'
import * as shallowEqual from 'fbjs/lib/shallowEqual'

function isFunction(v) {
  return typeof v === 'function'
}

function defaultToNull(v: any) {
  return v === void 0 ? null : v
}

function toElement(c, data = void 0) {
  return defaultToNull(isFunction(c) ? c(data) : c)
}

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
  test: PropTypes.any.isRequired,
  then: PropTypes.any.isRequired,
  else: PropTypes.any
}

/**
 * Render the result of dispatching to the `map` method of `target`
 * passing the `with` function as the first argument.
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

/**
 * Re-render the content of the `render` prop if the value of `test` is not shallow-equal
 * to the `test` value provided in the previous render.
 */
export class Pure extends React.Component<
  {
    test: any
    render: any
  }
  > {

  previousTest: any = null

  constructor(props, context) {
    super(props, context)
    this.previousTest = props.test
  }

  shouldComponentUpdate(nextProps, _) {
    const nextTest = nextProps.test
    const should = !shallowEqual(this.previousTest, nextTest)
    if (should) {
      this.previousTest = nextTest
    }
    return should
  }

  render() {
    return toElement(this.props.render, this.previousTest)
  }
}

(Pure as any).propTypes = {
  test: PropTypes.any.isRequired,
  render: PropTypes.any.isRequired
}