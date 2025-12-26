import * as PropsTypes from 'prop-types'
import { toElement } from './util'
import { useState, useEffect, createElement, Fragment } from 'react'

type AwaitState<T> = {
  status: 'pending' | 'resolved' | 'rejected'
  value?: T
  error?: any
}

export function Await<T extends any>({
  promise,
  placeholder,
  then,
  catch: _catch,
  finally: _finally,
  showStaleData = false,
}: {
  promise: Promise<T> | void
  placeholder?: any
  then?: React.ReactElement<any> | ((value: T) => React.ReactElement<any> | null)
  catch?: any
  finally?: any
  showStaleData?: boolean
}) {
  const [state, setState] = useState<AwaitState<T>>({
    status: 'pending',
  })

  useEffect(() => {
    let isCancelled = false

    if (!promise) {
      setState({ status: 'resolved' })
      return
    }

    setState(prevState => {
      if (showStaleData) {
        return { ...prevState, status: 'pending' }
      }
      return { status: 'pending' }
    })

    promise.then((value) => {
      if (!isCancelled) {
        setState({ status: 'resolved', value })
      }
    }).catch((error) => {
      if (!isCancelled) {
        setState({ status: 'rejected', error })
      }
    })

    return () => {
      isCancelled = true
    }
  }, [promise, showStaleData])

  if (state.status === 'pending') {
    if (showStaleData && state.value !== undefined) {
      return frag(toElement(then, state.value), toElement(_finally))
    }
    return frag(toElement(placeholder), toElement(_finally))
  }

  if (state.status === 'resolved') {
    return frag(toElement(then, state.value), toElement(_finally))
  }

  if (state.status === 'rejected') {
    return frag(toElement(_catch, state.error), toElement(_finally))
  }

  return toElement(_finally)
}

const frag = (...items: any[]) => {
  return createElement(Fragment, null, ...items)
}

(Await as any).propTypes = {
  promise: PropsTypes.any,
  then: PropsTypes.any.isRequired,
  placeholder: PropsTypes.any,
  catch: PropsTypes.any,
  finally: PropsTypes.any,
  showStaleData: PropsTypes.bool,
}
