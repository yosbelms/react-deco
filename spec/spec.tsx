import * as React from 'react'
import { If, Map } from '../src'
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
  })

  it('should render `else` if `test` is falsy', () => {
    const wrapper = mount(<RenderIf test={false} />)
    expect(wrapper.find('.then').length).toBe(0)
    expect(wrapper.find('.else').length).toBe(1)
  })

  it('should accept a predicate as `test`', () => {
    const wrapper = mount(<RenderIf test={() => true}/>)
    expect(wrapper.find('.then').length).toBe(1)
  })

  it('should accept a components in `then` and `else`', () => {
    const wrapper = mount(<RenderIfWithComponents test={true} />)
    expect(wrapper.find('.then').length).toBe(1)
    expect(wrapper.find('.else').length).toBe(0)

    const wrapperwc = mount(<RenderIfWithComponents test={false} />)
    expect(wrapperwc.find('.then').length).toBe(0)
    expect(wrapperwc.find('.else').length).toBe(1)
  })

})


describe('Map', () => {

  it('should work', () => {
    const wrapper = mount(<Map target={[1, 2, 3]} with={(item: number) => 
      <div key={item} className={'item'} />
    }/>)

    expect(wrapper.find('.item').length).toBe(3)
  })

})