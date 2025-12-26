# React Deco

*React Deco* Give back to JSX what belongs to JSX.

* [Overview](#overview)
* [Installation](#installation)
* [Usage](#usage)
* [Components](#components)
  * [If](#if)
  * [Switch/When](#switchwhen)
  * [Map](#map)
  * [Await](#await)
  * [Memo](#memo)
  * [TryCatch](#trycatch)

## Overview

*React Deco* is a library that aims to make complex React views more declarative, idiomatic, easy to read, and easy to write, and as a consequence, more maintainable.

This library takes advantage of the Render-Props pattern (effectively used by [React Router](https://reacttraining.com/react-router/web/api/Route) and [Downshift](https://github.com/paypal/downshift)) to make it possible to write conditionals and loops in a more declarative way while reducing visual clutter.

Lets write a simple table of products with two columns `Name` and `In Stock`. If `In Stock` is `0` then a message `Out of Stock` should be displayed. Currently we should write something like the following:

```tsx
function ProductTable({products}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>In Stock</th>
        </tr>
      </thead>
      {renderTableBody(products)}
    </table>
  )
}

function renderTableBody(products) {
  return (
    <tbody>
    {products.map((product) =>
      <tr key={product.id}>
        <td>{product.name}</td>
        {(product.inStock > 0)
          ? <td>{product.inStock}</td>
          : <td>Out of Stock</td>
        }
      </tr>
    )}
    </tbody>
  )
}
```

This library will turn the above code into:

```tsx
function ProductTable({products}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>In Stock</th>
        </tr>
      </thead>
      <tbody>
      <Map target={products} with={(product) =>
        <tr key={product.id}>
          <td>{product.name}</td>
          <If test={product.inStock > 0}
            then={<td>{product.inStock}</td>}
            else={<td>Out of Stock</td>}
          />
        </tr>
      }/>
      </tbody>
    </table>
  )
}
```

## Installation

```
// with yarn
yarn add react-deco

// with npm
npm install react-deco
```

## Usage

```ts
// ES2015+ and TS
import {If, Map, Memo, TryCatch} from 'react-deco'

// CommonJS
var ReactDeco = require('react-deco')
var If = ReactDeco.If
var Map = ReactDeco.Map
var Memo = ReactDeco.Memo
var TryCatch = ReactDeco.TryCatch
```

## Components

React-Deco exports some primitives which hold reusable logic, to help developers to write *presentational logic* in JSX.

### If

Conditionally render components based on the truthy-ness of evaluating the `test` prop. Render `then` if `test` evaluates to truthy, render `else` otherwise.

```tsx
<If
  test={a > b}
  then={'a is greater then b'}
  else={'a is not greater than b'}
/>
```

Passing functions in `then` and `else` makes the rendering process more efficient because only one of both branches is evaluated depending on the truthy-ness of `test`. See [Short Circuit Evaluation](https://en.wikipedia.org/wiki/Short-circuit_evaluation)
```tsx
<If
  test={a > b}
  then={() => 'a is greater then b'}
  else={() => 'a is not greater than b'}
/>
```

### Switch/When

Render the first `When` child whose `test` prop evaluates to `true`.

```tsx
<Switch>
  <When test={a > 1} render={() => <div> Foo </div>} />
  <When test={true} render={() => <div> Default </div>} />
</Switch>
```

### Map

Render the result of dispatching to the `map` method of `target` passing the `with` function as the first argument.

```tsx
<Map target={[1, 2, 3]} with={(item) =>
  <div key={item}>{item}</div>
} />
```

### Await

Render components based on the state of a promise. Renders `then` prop when the promise is resolved. Renders `catch` prop when the promise is rejected. Renders `placeholder` while the promise is not resolved nor rejected.

```tsx
const usersPromise = fetch('users')
<Await promise={usersPromise} then={users =>
  ...
} />
```

While a new promise is pending, you can choose to show the data from the last successful promise by using the `showStaleData` prop.

```tsx
<Await
  promise={newUsersPromise}
  then={users => ...}
  showStaleData={true}
/>
```

`Await` components accept the following props:

* `promise`
* `then`
* `catch`
* `placeholder`
* `finally`: A render prop that is always rendered when the promise settles.
* `showStaleData`: A boolean that, if true, will show the stale data from the previous promise while the new one is loading. Defaults to `false`.

### Memo

Memoizes a rendered component, preventing it from re-rendering if its dependencies have not changed. This is useful for optimizing performance.

```tsx
<Memo deps={[user.id]} render={() =>
  <div>{user.name}</div>
} />
```

The `render` prop will only be re-evaluated if the `deps` array changes.

`Memo` components accept the following props:

* `deps`: An array of dependencies. The component will re-render only if the values in this array change.
* `render`: A function that returns a React element to be rendered.

### TryCatch

A declarative error boundary to catch errors in a component subtree.

```tsx
<TryCatch
  try={() => <MyComponentThatMightFail />}
  catch={(error, errorInfo) => <p>Failed to render: {error.toString()}</p>}
  onError={(error, errorInfo) => console.error('Caught an error:', error)}
/>
```

`TryCatch` components accept the following props:

* `try`: A function that returns the content to be rendered.
* `catch`: A function that is called when an error is caught. It receives the `error` and `errorInfo` as arguments and should return the fallback content to be rendered.
* `onError`: An optional function that is called when an error is caught. It receives the `error` and `errorInfo` as arguments. This is useful for logging errors or performing other side effects.

Published under MIT License

(c) Yosbel Marin 2025