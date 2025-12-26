import * as PropTypes from 'prop-types'
import { toElement } from './util'
import { useMemo } from 'react'

/**
 * Memoizes a component, preventing it from re-rendering unless its `deps` have changed.
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