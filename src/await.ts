import * as React from 'react'
import * as PropsTypes from 'prop-types'
import { toElement } from './util'

export const enum Status {
  AWAITING = 0,
  SUCCESS = 1,
  FAILED = 2
}

/**
 * Render components based on the state of a promise. Renders `then` prop when the promise is resolved.
 * Renders `catch` prop when the promise is rejected. Renders `placeholder` while the promise is not
 * resolved nor rejected.
 */
export class Await<T extends any> extends React.PureComponent<{
  promise: Promise<T> | void
  placeholder?: any
  then?: React.ReactElement<any> | ((value?: T) => React.ReactElement<any>)
  catch?: any
}, {
  loading: boolean
  value: any
  reason: any
}> {
  promise: Promise<any> | void

  constructor(props) {
    super(props)
    this.promise = null
    this.state = {
      loading: true,
      value: void 0,
      reason: void 0
    }
  }

  render() {
    const { promise, placeholder, then, catch: _catch } = this.props

    if (!this.state.loading && this.promise && this.promise !== promise) {
      Promise.resolve().then(() => this.setState({
        loading: true
      }))
    }

    this.promise = promise

    if (promise && typeof promise.then === 'function') {
      promise.then((value) => {
        this.setState({
          loading: false,
          value: value,
          reason: void 0
        })
      }, (reason) => {
        this.setState({
          loading: false,
          value: void 0,
          reason: reason
        })
      })
    }

    if (this.state.loading && placeholder) {
      return toElement(placeholder)
    } else if (this.state.value) {
      return toElement(then, this.state.value)
    } else if (this.state.reason) {
      return toElement(_catch, this.state.reason)
    }

    return null
  }
}

(Await as any).propTypes = {
  promise: PropsTypes.any.isRequired,
  then: PropsTypes.any.isRequired,
  placeholder: PropsTypes.any,
  catch: PropsTypes.any
}
