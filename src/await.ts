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
export class Await<T extends any> extends React.Component<{
  promise: Promise<T>
  then: React.ReactElement<any> | ((value?: T) => React.ReactElement<any>)
  catch?: any
  placeholder?: any
}, {
  status: Status
  value: T
  failReason: any
}> {

  constructor(props, ctx) {
    super(props, ctx)
    this.state = {
      status: Status.AWAITING,
      value: void 0,
      failReason: void 0
    }
  }

  componentDidMount() {
    this.props.promise.then((value: T) => {
      this.setState({ status: Status.SUCCESS, value: value })
    }, (reason) => {
      this.setState({ status: Status.FAILED, failReason: reason })
    })
  }

  render() {
    switch (this.state.status) {
      case Status.AWAITING:
        return toElement(this.props.placeholder)
      case Status.SUCCESS:
        return toElement(this.props.then, this.state.value)
      case Status.FAILED:
        return toElement(this.props.catch, this.state.failReason)
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
