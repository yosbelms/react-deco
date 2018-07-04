# React Deco

*React Deco* is a library that aims to make React views more declarative, idiomatic, easy to read, and easy to write.

JSX is a declarative syntax to compose virtual-dom pieces of views. But, sometimes we need to put some logic down, for example, conditionally render components, or show them as a result of looping a list of values. JSX proposes either to create a new component/function to handle that logic, or intermix JS code inside the view.

This library takes advantage of React Higher Order Componets, and Render-Props pattern to make possible to write conditionals and loops in a more declarative way while reducing visual cluttering.

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

## If

Conditionally render components based on the truthy-ness of evaluating the `test` prop. Render `then` if `test` evaluates to truthy, render `else` otherwise.

```tsx
<If
  test={a > b}
  then={'a is greater then b'}
  else={'a is not greater than b'}
/>
```

## Map

Render the result of dispatching to the `map` method of `target` passing the `with` function as the first argument.

```tsx
<Map target={[1, 2, 3]} with={(item) =>
  <div key={item}>{item}</div>
} />
```