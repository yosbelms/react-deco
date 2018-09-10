import * as React from 'react'
import { If, Map, Switch, When, Bare } from '../src'
import { mount } from 'enzyme'

function RenderIf({ test }: { test: any }) {
  return (
    <If test={test}
      then={<div className='then' />}
      else={<div className='else' />}
    />
  )
}

function RenderIfWithComponents({ test }: { test: any }) {
  return (
    <If test={test}
      then={() => <div className='then' />}
      else={() => <div className='else' />}
    />
  )
}

describe('If', () => {

  it('should render `then` if `test` is truthy', () => {
    const wrapper = mount(<RenderIf test={true} />)
    expect(wrapper.find('.then').length).toBe(1)
    expect(wrapper.find('.else').length).toBe(0)
    wrapper.unmount()
  })

  it('should render `else` if `test` is falsy', () => {
    const wrapper = mount(<RenderIf test={false} />)
    expect(wrapper.find('.then').length).toBe(0)
    expect(wrapper.find('.else').length).toBe(1)
    wrapper.unmount()
  })

  it('should accept a components in `then` and `else`', () => {
    const wrapper = mount(<RenderIfWithComponents test={true} />)
    expect(wrapper.find('.then').length).toBe(1)
    expect(wrapper.find('.else').length).toBe(0)
    wrapper.unmount()

    const wrapperwc = mount(<RenderIfWithComponents test={false} />)
    expect(wrapperwc.find('.then').length).toBe(0)
    expect(wrapperwc.find('.else').length).toBe(1)
    wrapperwc.unmount()
  })

})


describe('Map', () => {

  it('should work', () => {
    const wrapper = mount(<Map target={[1, 2, 3]} with={(item: number) =>
      <div key={item} className={'item'} />
    } />)

    expect(wrapper.find('.item').length).toBe(3)
    wrapper.unmount()
  })

})

describe('Switch', () => {
  it('Should mount the first When element which test is truthy', () => {
    let wrapper = mount(
      <Switch>
        <When test={true} render={() => <div className='div' />} />
        <When test={false} render={() => <div />} />
      </Switch>
    )

    let res = wrapper.find('.div')
    expect(res.length).toBe(1)

    wrapper.unmount()

    wrapper = mount(
      <Switch>
        <When test={false} render={() => <div className='div' />} />
        <When test={true} render={() => <div />} />
      </Switch>
    )

    res = wrapper.find('.div')
    expect(res.length).toBe(0)

    wrapper.unmount()
  })

  it('When, should allow functions as test', () => {
    let wrapper = mount(
      <Switch>
        <When test={() => false} render={() => <div className='div' />} />
      </Switch>
    )

    let res = wrapper.find('.div')
    expect(res.length).toBe(0)

    wrapper.unmount()
  })
})


describe('Bare', () => {
  it('Should execute constructor prop function on construct', () => {
    let executed
    let wrapper = mount(
      <Bare constructor={() => executed = true} render={'blah'} />
    )

    expect(executed).toBe(true)

    wrapper.unmount()
  })

  it('Should execute didCatch prop function on error', () => {
    let caugh
    let wrapper = mount(
      <Bare didCatch={() => caugh = true} render={() =>
        <Bare render={() => { throw new Error('boom') }} />
      } />
    )

    expect(caugh).toBe(true)

    wrapper.unmount()
  })

  it('Should execute lifecycle in order', () => {
    let counter = 1
    const count = () => counter++
    let lifecycle = {
      didMount: 0,
      didUpdate: 0,
      shouldUpdate: 0,
      willUnmount: 0
    }

    let wrapper = mount(
      <Bare
        didMount={() => lifecycle.didMount = count()}
        didUpdate={() => lifecycle.didUpdate = count()}
        shouldUpdate={() => lifecycle.shouldUpdate = count()}
        willUnmount={() => lifecycle.willUnmount = count()}

        render={'blah'}
      />
    )

    // force update
    wrapper.setState({})

    wrapper.unmount()

    expect(lifecycle).toEqual({
      didMount: 1,
      didUpdate: 3,
      shouldUpdate: 2,
      willUnmount: 4
    })
  })

  it('Should prevent rerendering by returning false in shouldUpdate', () => {
    let updated
    let wrapper = mount(
      <Bare
        didUpdate={() => updated = true}
        shouldUpdate={() => false}
        render={'blah'}
      />
    )

    // force update
    wrapper.setState({})

    expect(updated).toBeUndefined()

    wrapper.unmount()
  })
})

function RenderPure({ pureBy }: { pureBy: any }) {
  const rand = Math.random()
  return (
    <Bare pureBy={pureBy} render={
      <div className='div' data-rand={rand} />
    } />
  )
}

function RenderPureWithFunctionBody({ pureBy }: { pureBy: any }) {
  return (
    <Bare pureBy={pureBy} render={(cmp) =>
      <div className={cmp.props.pureBy} />
    } />
  )
}

describe('Bare with pureBy', () => {

  it('should update only if `pureBy` is changed', () => {
    let wrapper = mount(<RenderPure pureBy={['a', 'b']} />)

    let div = wrapper.find('.div').getDOMNode()
    expect(div).toBeTruthy()

    let rand = div.getAttribute('data-rand')

    // rerender
    wrapper.setProps({ test: ['a', 'b'] })

    div = wrapper.find('.div').getDOMNode()
    expect(div.getAttribute('data-rand')).toBe(rand)

    // rerender
    wrapper.setProps({ pureBy: ['b', 'a'] })

    div = wrapper.find('.div').getDOMNode()
    expect(div.getAttribute('data-rand')).not.toBe(rand)

    wrapper.unmount()
  })

  it('should work if `render` is a function', () => {
    let wrapper = mount(<RenderPureWithFunctionBody pureBy={'div'} />)

    let res = wrapper.find('.div')
    expect(res.length).toBe(1)

    wrapper.unmount()
  })

})