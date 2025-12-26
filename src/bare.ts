import * as PropTypes from 'prop-types'
import * as React from 'react'
import { shallowEqual, isFunction, toElement } from './util'

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
 * A component that its `constructor`, `shouldComponentUpdate`, and lifecycle methods
 * can be assigned via props
 * @deprecated React Hooks addresses the same problem that this component was created for.
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
  self: React.Component

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

    this.self = this

    // make setState usable inside the constructor
    const originalSetState = this.setState.bind(this)
    if (isFunction(constructor)) {
      this.setState = (updater?: any, callback?: () => void) => {
        this.state = isFunction(updater) ? updater({}) : updater
        if (isFunction(callback)) {
          callback()
        }
      }
      constructor(this, props, ctx)
    }

    this.setState = originalSetState.bind(this)
    this.forceUpdate = this.forceUpdate.bind(this)

    if (isFunction(didCatch)) {
      this.componentDidCatch = prependArg(didCatch, this)
    }

    if (isFunction(didMount)) {
      this.componentDidMount = prependArg(didMount, this)
    }

    if (isFunction(didUpdate)) {
      this.componentDidUpdate = (_: any, prevState: any) => didUpdate(this, prevState)
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
      this.shouldComponentUpdate = (_: any, nextState: any) => shouldUpdate(this, nextState)
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