# React Deco

*React Deco* Give back to JSX what is JSX’s


*React Deco* is a library that aims to make React complex views more declarative, idiomatic, easy to read, and easy to write, by consequence more mantainables.

This library takes advantage of Render-Props pattern (effectively used by [React Router](https://reacttraining.com/react-router/web/api/Route) and [Downshift](https://github.com/paypal/downshift)) to make possible to write conditionals and loops in a more declarative way while reducing visual cluttering.

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
      <tr>
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

With this library will turn the above code into:

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
        <tr>
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

## Install

```
// with yarn
yarn add react-deco

// with npm
npm install react-deco
```

## Usage
```ts
// ES2015+ and TS
import {If, Map, Bare} from 'react-deco'

// CommonJS
var ReactDeco = require('react-deco')
var If = ReactDeco.If
var Map = ReactDeco.Map
var Bare = ReactDeco.Bare
```

## If

Conditionally render components based on the truthy-ness of evaluating the `test` prop. Render `then` if `test` evaluates to truthy, render `else` otherwise.

```tsx
<If
  test={a > b}
  then={'a is greater then b'}
  else={'a is not greater than b'}
/>
```

Passign functions in `then` and `else` makes the rendering process more efficient because only one of both branches is evalueted depending on truthy-ness of `test`. See [Short Circuit Evaluation](https://en.wikipedia.org/wiki/Short-circuit_evaluation)
```tsx
<If
  test={a > b}
  then={() => 'a is greater then b'}
  else={() => 'a is not greater than b'}
/>
```

## Map

Render the result of dispatching to the `map` method of `target` passing the `with` function as the first argument.

```tsx
<Map target={[1, 2, 3]} with={(item) =>
  <div key={item}>{item}</div>
} />
```

## Bare

A component that its `constructor`, `shouldComponentUpdate`, and lifecycle methods can be assigned via props

```tsx
<Bare shouldUpdate={shouldUpdateFn} render={() =>
  ...
} />
```

`Bare` componets accept the following props:

* `render`
* `constructor`
* `didCatch`
* `didMount`
* `didUpdate`
* `shouldUpdate`
* `willUnmount`

The functions provided to those props receives the component instance as the first parametter, the rest are the corresponding arguments passed by React.

Additionaly, `Bare` components accepts a prop named `pureBy`. In case this property is provided the passed value will be used to compute the component purity using shallow comparison, if it is an array the shallow comparison will be computed by shallow-comparing each value in the array.

```tsx
<Bare pureBy={client} render={() =>
  <div>{client.name}</div>
  <div>{client.age}</div>
} />
```

The above code will re-render only if one of the properties of the `client` object is different.


Published under MIT Licence

(c) Yosbel Marin 2018