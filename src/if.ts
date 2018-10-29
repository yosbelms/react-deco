import * as PropTypes from 'prop-types'
import { toElement } from './util'

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