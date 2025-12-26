import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { If, Map, Switch, When, Bare, Await, Memo } from '../src';

function RenderIf({ test }: { test: any }) {
  return (
    <If
      test={test}
      then={<div className='then' />}
      else={<div className='else' />}
    />
  );
}

function RenderIfWithComponents({ test }: { test: any }) {
  return (
    <If
      test={test}
      then={() => <div className='then' />}
      else={() => <div className='else' />}
    />
  );
}

describe('If', () => {
  it('should render `then` if `test` is truthy', () => {
    render(<RenderIf test={true} />);
    expect(screen.getByText('', { selector: '.then' })).toBeInTheDocument();
    expect(screen.queryByText('', { selector: '.else' })).not.toBeInTheDocument();
  });

  it('should render `else` if `test` is falsy', () => {
    render(<RenderIf test={false} />);
    expect(screen.queryByText('', { selector: '.then' })).not.toBeInTheDocument();
    expect(screen.getByText('', { selector: '.else' })).toBeInTheDocument();
  });

  it('should accept a components in `then` and `else`', () => {
    const { rerender } = render(<RenderIfWithComponents test={true} />);
    expect(screen.getByText('', { selector: '.then' })).toBeInTheDocument();
    expect(screen.queryByText('', { selector: '.else' })).not.toBeInTheDocument();

    rerender(<RenderIfWithComponents test={false} />);
    expect(screen.queryByText('', { selector: '.then' })).not.toBeInTheDocument();
    expect(screen.getByText('', { selector: '.else' })).toBeInTheDocument();
  });
});

describe('Map', () => {
  it('should work', () => {
    render(
      <Map
        target={[1, 2, 3]}
        with={(item: number) => <div key={item} className={'item'} />}
      />
    );

    expect(screen.getAllByText('', { selector: '.item' }).length).toBe(3);
  });

  it('should allow index and target', () => {
    render(
      <Map
        target={[1, 2, 3]}
        with={(_, idx: number, __) => <div key={idx} className={'item'} />}
      />
    );

    expect(screen.getAllByText('', { selector: '.item' }).length).toBe(3);
  });
});

describe('Switch', () => {
  it('Should mount the first When element which test is truthy', () => {
    const { rerender } = render(
      <Switch>
        <When test={true} render={() => <div className='div' />} />
        <When test={false} render={() => <div />} />
      </Switch>
    );

    expect(screen.getByText('', { selector: '.div' })).toBeInTheDocument();

    rerender(
      <Switch>
        <When test={false} render={() => <div className='div' />} />
        <When test={true} render={() => <div />} />
      </Switch>
    );

    expect(screen.queryByText('', { selector: '.div' })).not.toBeInTheDocument();
  });

  it('When, should allow functions as test', () => {
    render(
      <Switch>
        <When test={() => false} render={() => <div className='div' />} />
      </Switch>
    );

    expect(screen.queryByText('', { selector: '.div' })).not.toBeInTheDocument();
  });
});

describe('Bare', () => {
  it('Should execute constructor prop function on construct', () => {
    let executed = false;
    render(<Bare constructor={() => (executed = true)} render={'blah'} />);
    expect(executed).toBe(true);
  });

  it('Should execute didCatch prop function on error', () => {
    const ErrorComponent = () => {
      throw new Error('boom');
    };
    let caugh = false;
    render(
      <Bare
        didCatch={() => (caugh = true)}
        render={() => <ErrorComponent />}
      />
    );
    expect(caugh).toBe(true);
  });

  it('Should execute lifecycle in order', () => {
    let counter = 1;
    const count = () => counter++;
    const lifecycle: any = {
      didMount: 0,
      didUpdate: 0,
      shouldUpdate: 0,
      willUnmount: 0,
    };

    const didMount = vi.fn(() => (lifecycle.didMount = count()));
    const didUpdate = vi.fn(() => (lifecycle.didUpdate = count()));
    const shouldUpdate = vi.fn(() => {
      lifecycle.shouldUpdate = count();
      return true;
    });
    const willUnmount = vi.fn(() => (lifecycle.willUnmount = count()));

    const { rerender, unmount } = render(
      <Bare
        didMount={didMount}
        didUpdate={didUpdate}
        shouldUpdate={shouldUpdate}
        willUnmount={willUnmount}
        render={'blah'}
      />
    );

    rerender(
      <Bare
        didMount={didMount}
        didUpdate={didUpdate}
        shouldUpdate={shouldUpdate}
        willUnmount={willUnmount}
        render={'blah blah'}
      />
    );

    unmount();

    expect(lifecycle).toEqual({
      didMount: 1,
      shouldUpdate: 2,
      didUpdate: 3,
      willUnmount: 4,
    });
  });

  it('Should prevent rerendering by returning false in shouldUpdate', () => {
    const didUpdate = vi.fn();
    const { rerender } = render(
      <Bare
        didUpdate={didUpdate}
        shouldUpdate={() => false}
        render={'blah'}
      />
    );

    rerender(
      <Bare
        didUpdate={didUpdate}
        shouldUpdate={() => false}
        render={'blah blah'}
      />
    );

    expect(didUpdate).not.toHaveBeenCalled();
  });
});

function RenderPure({ pureBy }: { pureBy: any }) {
  const rand = Math.random();
  return (
    <Bare pureBy={pureBy} render={<div className='div' data-rand={rand} />} />
  );
}

function RenderPureWithFunctionBody({ pureBy }: { pureBy: any }) {
  return (
    <Bare
      pureBy={pureBy}
      render={(cmp: any) => <div className={cmp.props.pureBy} />}
    />
  );
}

describe('Bare with pureBy', () => {
  it('should update only if `pureBy` is changed', () => {
    const { rerender } = render(<RenderPure pureBy={['a', 'b']} />);
    const div = screen.getByText('', { selector: '.div' });
    const rand = div.getAttribute('data-rand');

    rerender(<RenderPure pureBy={['a', 'b']} />);
    expect(div.getAttribute('data-rand')).toBe(rand);

    rerender(<RenderPure pureBy={['b', 'a']} />);
    expect(div.getAttribute('data-rand')).not.toBe(rand);
  });

  it('should work if `render` is a function', () => {
    render(<RenderPureWithFunctionBody pureBy={'div'} />);
    expect(screen.getByText('', { selector: '.div' })).toBeInTheDocument();
  });
});

describe('Await', () => {
  it('should pass the promise value to the `then` prop', async () => {
    const promise = Promise.resolve('then');
    render(
      <Await
        promise={promise}
        then={(cls: string) => <div className={cls} />}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('', { selector: '.then' })).toBeInTheDocument();
    });
  });

  it('should pass the reject reason `catch` prop', async () => {
    const promise = Promise.reject('error');
    // prevent uncaught promise rejection warning
    promise.catch(() => {});
    render(
      <Await
        promise={promise}
        then={() => null}
        catch={(cls: any) => <div className={cls} />}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('', { selector: '.error' })).toBeInTheDocument();
    });
  });

  it('should render placeholder if the promise is not still resolved', async () => {
    const promise = new Promise(() => {}); // never resolves
    render(
      <Await
        promise={promise}
        then={() => <div className='then' />}
        placeholder={() => <div className='placeholder' />}
      />
    );

    expect(screen.getByText('', { selector: '.placeholder' })).toBeInTheDocument();
  });

  it('should render the finally prop on resolved', async () => {
    const promise = Promise.resolve('then');
    render(
      <Await
        promise={promise}
        then={(cls: string) => <div className={cls} />}
        finally={() => <div className="finally" />}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('', { selector: '.then' })).toBeInTheDocument();
      expect(screen.getByText('', { selector: '.finally' })).toBeInTheDocument();
    });
  });

  it('should render the finally prop on rejected', async () => {
    const promise = Promise.reject('error');
    promise.catch(() => {});
    render(
      <Await
        promise={promise}
        catch={(cls: any) => <div className={cls} />}
        finally={() => <div className="finally" />}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('', { selector: '.error' })).toBeInTheDocument();
      expect(screen.getByText('', { selector: '.finally' })).toBeInTheDocument();
    });
  });

  it('should show stale data while revalidating if showStaleData is true', async () => {
    const promise1 = Promise.resolve('data1');
    const { rerender } = render(
      <Await
        promise={promise1}
        then={(data: string) => <div>{data}</div>}
        placeholder={() => <div>placeholder</div>}
        showStaleData={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('data1')).toBeInTheDocument();
    });

    const promise2 = new Promise(resolve => setTimeout(() => resolve('data2'), 100));
    rerender(
      <Await
        promise={promise2}
        then={(data: string) => <div>{data}</div>}
        placeholder={() => <div>placeholder</div>}
        showStaleData={true}
      />
    );

    // While promise2 is pending, we should still see the stale data from promise1
    expect(screen.getByText('data1')).toBeInTheDocument();
    expect(screen.queryByText('placeholder')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('data2')).toBeInTheDocument();
    });
  });

  it('should show placeholder while revalidating if showStaleData is false', async () => {
    const promise1 = Promise.resolve('data1');
    const { rerender } = render(
      <Await
        promise={promise1}
        then={(data: string) => <div>{data}</div>}
        placeholder={() => <div>placeholder</div>}
        showStaleData={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('data1')).toBeInTheDocument();
    });

    const promise2 = new Promise(resolve => setTimeout(() => resolve('data2'), 100));
    rerender(
      <Await
        promise={promise2}
        then={(data: string) => <div>{data}</div>}
        placeholder={() => <div>placeholder</div>}
        showStaleData={false}
      />
    );

    // While promise2 is pending, we should see the placeholder
    expect(screen.getByText('placeholder')).toBeInTheDocument();
    expect(screen.queryByText('data1')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('data2')).toBeInTheDocument();
    });
  });
});

describe('Memo', () => {
  const renderFn = vi.fn();

  function ComponentToMemo() {
    renderFn();
    return <div>Hello</div>;
  }

  beforeEach(() => {
    renderFn.mockClear();
  });

  it('should render the component', () => {
    render(<Memo render={<ComponentToMemo />} />);
    expect(renderFn).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should not re-render if deps are the same', () => {
    const { rerender } = render(<Memo deps={[1]} render={<ComponentToMemo />} />);
    expect(renderFn).toHaveBeenCalledTimes(1);

    rerender(<Memo deps={[1]} render={<ComponentToMemo />} />);
    expect(renderFn).toHaveBeenCalledTimes(1);
  });

  it('should re-render if deps change', () => {
    const { rerender } = render(<Memo deps={[1]} render={<ComponentToMemo />} />);
    expect(renderFn).toHaveBeenCalledTimes(1);

    rerender(<Memo deps={[2]} render={<ComponentToMemo />} />);
    expect(renderFn).toHaveBeenCalledTimes(2);
  });

  it('should work with a render function', () => {
    const { rerender } = render(<Memo deps={[1]} render={() => <ComponentToMemo />} />);
    expect(renderFn).toHaveBeenCalledTimes(1);

    rerender(<Memo deps={[2]} render={() => <ComponentToMemo />} />);
    expect(renderFn).toHaveBeenCalledTimes(2);
  });
});