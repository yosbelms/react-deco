import * as PropTypes from 'prop-types'
import { toElement } from './util'
import { useMemo } from 'react'

/**
 * Conditionally render components based on the truthy-ness of evaluating the `test` prop.
 * Render `then` if `test` evaluates to truthy, render `else` otherwise.
 */
export function Memo({ deps = [], render }: {
  deps?: any,
  render: any,
}) {
  return useMemo(() => toElement(render), deps)
}

(Memo as any).propTypes = {
  deps: PropTypes.array,
  render: PropTypes.any.isRequired,
}