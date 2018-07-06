import * as React from 'react'
import { If, Map, Pure } from '../src'
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

function RenderPure({ test }: { test: any }) {
  const rand = Math.random()
  return (
    <Pure test={test} render={
      <div className='div' data-rand={rand} />
    } />
  )
}

function RenderPurePassingProps({ test }: { test: any }) {
  return (
    <Pure test={test} render={(cls) =>
      <div className={cls} />
    } />
  )
}

describe('Pure', () => {

  it('should update only if `test` id changed', () => {
    let wrapper = mount(<RenderPure test={['a', 'b']} />)

    let div = wrapper.find('.div').getDOMNode()
    expect(div).toBeTruthy()

    let rand = div.getAttribute('data-rand')

    // rerender
    wrapper.setProps({ test: ['a', 'b'] })

    div = wrapper.find('.div').getDOMNode()
    expect(div.getAttribute('data-rand')).toBe(rand)

    // rerender
    wrapper.setProps({ test: ['b', 'a'] })

    div = wrapper.find('.div').getDOMNode()
    expect(div.getAttribute('data-rand')).not.toBe(rand)

    wrapper.unmount()
  })

  it('should pass tested values to `render` if it is a function', () => {
    let wrapper = mount(<RenderPurePassingProps test={'div'} />)

    let res = wrapper.find('.div')
    expect(res.length).toBe(1)

    wrapper.unmount()
  })

})