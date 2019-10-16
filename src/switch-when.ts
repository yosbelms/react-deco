import * as PropTypes from 'prop-types'
import * as React from 'react'
import { toBoolean, toElement } from './util'

/**
 * Render the first `When` child whose`test` prop evaluates to true.
 */
export function Switch({ children }: { children: any }) {
  let choice

  React.Children.forEach(children, child => {
    if (
      choice === void 0 &&
      React.isValidElement(child) &&
      (child.type as any)._isWhen &&
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

(When as any)._isWhen = true;

(When as any).propTypes = {
  test: PropTypes.any,
  render: PropTypes.any.isRequired
}