import * as PropTypes from 'prop-types'
import * as React from 'react'
import { createElement, ReactElement } from 'react'

export type Mapper<T> = (value: T, key: number, target: T[]) => any;

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