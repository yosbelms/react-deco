# React declarative control flow

This library takes advantage of React Higher Order Componets, and Render-Props pattern to make possible to write conditionals and loops in a more idiomatic and declarative way while reducing visual cluttering.

JSX is a declarative syntax to compose virtual-dom pieces of views. But, sometimes we need to put some logic down, for example, conditionally render components, or show them as a result of looping a list of values. JSX proposes either to create a new component/function to handle that logic, or intermix JS code inside the view.

This library is an approach to be more declarative and idiomatic.

```tsx
<If
  test={a > b} // also accepts a predicate function
  then={'a is greater then b'}
  else={'a is not greater than b'}
/>
```

```tsx
<Map target={[1, 2, 3]} with={(item) =>
  <div key={item}>{item}</div>
} />
```