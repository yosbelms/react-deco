import { Component } from 'react'
import * as PropTypes from 'prop-types'
import { toElement } from './util'

export class TryCatch extends Component<{
  try: () => any,
  catch: (error: Error, errorInfo: any) => any,
  onError?: (error: Error, errorInfo: any) => any,
}, {
  hasError: boolean,
  error: Error | null,
  errorInfo: any,
}> {
  static propTypes = {
    try: PropTypes.func.isRequired,
    catch: PropTypes.func.isRequired,
    onError: PropTypes.func,
  }

  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  componentDidCatch(error: Error | null, errorInfo: any) {
    this.props.onError?.(error, errorInfo)
    this.setState({
      hasError: true,
      error,
      errorInfo,
    })
  }

  render() {
    return (this.state.hasError
      ? toElement(this.props.catch, [this.state.error, this.state.errorInfo])
      : toElement(this.props.try)
    )
  }
}
