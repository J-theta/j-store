# j-Store

Use the localStorage like a small database.

> This package was created for me to use in my own projects,
> but i thought that will be useful for others to use

See this simple [Todo App](https://todo-app-self.now.sh/) that uses jStore.

__Some warnings__
1. This project is still in development, so pardon for any bugs.
2. I'm from brazil and my english is not so great, so if you see an english error in this documentation, i'm sorry.
3. Please, consider using a real database if you want to hold sensitive information.

### Instalation

```
npm i --save @j-theta/j-store
```

### Usage

```javascript
import jStore from '@j-theta/j-store';
// will save the object passed in the localStorage 
// if there are already an object in the localStorage with the key
// __JSTORE__, then this object will be ignored
// and the object in the localStorage will be loaded instead
const store = new jStore({
  users: {
    "45": { age: 37, name: "Dorothy Nelson"     },
    "59": { age: 40, name: "Randy Floyd"        },
    "57": { age: 31, name: "Lillian Russell"    },
    "28": { age: 37, name: "Ray Adkins"         },
    "42": { age: 21, name: "Jonathan Hernandez" },
  },
  cities: [
    'Medufpuh',
    'Oguagwon',
    'Wuhaful',
    'Pitburi',
    'Mimekiras',
    'Suvvakpo',
  ]
});

// get the users
store.get('/users')
/*
  [
    { age: 37, name: "Dorothy Nelson"     },
    { age: 40, name: "Randy Floyd"        },
    { age: 31, name: "Lillian Russell"    },
    { age: 37, name: "Ray Adkins"         },
    { age: 21, name: "Jonathan Hernandez" },
  ]
*/

store.get('/users/28') // { age: 37, name: "Ray Adkins" }

// get the cities
store.get('/cities')
/*
  [
    'Medufpuh',
    'Oguagwon',
    'Wuhaful',
    'Pitburi',
    'Mimekiras',
    'Suvvakpo',
  ]
*/

// if you want an item from an array with specific index
store.get('/cities/0') // 'Medufpuh'

// adding an item in the storage
store.post('/hello', 'world!')

store.get('/hello') // 'world!'

// remove an item from the storage
store.remove('/hello')

store.get('/hello') // undefined
```
### The _jStore_ class constructor

```typescript
constructor(data: object, listeners?: Partial<Listeners>)
```

### Properties

1. __store__ - Get the current `store` data
  
### Methods

1. __get__ - Get data from store with the given `path`
```typescript
public get(path?: string, options?: options): any;
```
2. __set__ - Set new data in the given `path`
```typescript
public set(path: string, data: any): void;
```
3. __post__ - Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly override the data of an path that already exists.
```typescript
public post(path: string, data: any): void;
```
4. __reset__ - Reset the `store` to its *default* state.
```typescript
public reset(): void;
```
5. __remove__ - Remove a path from the `store`.
```typescript
public remove(path: string): void;
```
6. __add__ - Add new items to an array in the `store`.
```typescript
public add(path: string, value: any, index?: number): void;
```
7. __exists__ - Test if a path exists in the `store`
```typescript
public exists(path: string): void;
```
8. __on__ - Add a `event listener` to the store.
```typescript
public on(method: Method, handler: (...args: any[]) => void) : void
```

### Options to get

```typescript
interface options {
    /** A function to filter the results */
    where?: (value: any, index: number) => boolean;
    /** a string property to order the results */
    orderBy?: string;
    /** Determine if the result order will be `descending` */
    desc?: boolean;
    /** Determine if the result order will be 'ascending' */
	  asc?: boolean;
    /** an integer to limit the results */
    limit?: number;
}
```

#### Filtering the results
> Using the store from the previous example
```javascript
store.get('/cities', {
  where: citie => citie.startsWith('M')
}) // ['Medufpuh', 'Mimekiras']
```

#### Ordering the results
> Order ascending will be the default
```javascript
store.get('/users', { orderBy: 'age' })
/*
  [
    { age: 21, name: "Jonathan Hernandez" },
    { age: 31, name: "Lillian Russell"},
    { age: 37, name: "Ray Adkins"},
    { age: 37, name: "Dorothy Nelson"},
    { age: 40, name: "Randy Floyd"},
  ]
*/
```
> But, you can order the results descending if you want
```javascript
store.get('/users', { orderBy: 'age', desc: true })
/*
  [
    { age: 40, name: "Randy Floyd"},
    { age: 37, name: "Dorothy Nelson"},
    { age: 37, name: "Ray Adkins"},
    { age: 31, name: "Lillian Russell"},
    { age: 21, name: "Jonathan Hernandez"},
  ]
*/
```

#### Limiting the results
```javascript
store.get('/users', { limit: 2 })
/*
  [
    { age: 37, name: "Dorothy Nelson"},
    { age: 40, name: "Randy Floyd"},
  ]
*/
```

### Events

You can add some event listeners to control how your __store__ is manipulated.

```typescript
store.on(method: Method, handler);

type Method = 'get' | 'set' | 'post' | 'remove' | 'reset' | 'add';
```

#### Examples:

1. __Get logs__
```javascript 
store.on('get', path => console.log(`The path ${path} has been accessed`))

store.get('/users') // logs: The path /users has been accessed
```
2. __Data validation__
> If you return a value in the callback passed in the __on__ method, then the post method will return that value before sending the data to the store. This is useful when you want to validate new data.
```javascript
store.on('post', (path, data) => {
  if (path.startsWith('/user')) {
    const { name, age } = data;
    if (name.trim() === '') return new Error('The user name must be valid')
    if (age < 18) return new Error('The user must be adult')
  }
})
```
3. __Simulate a protected route__
> You can use examples like this to protect some paths to be accessed.
```javascript
store.on('get', path => {
  if (path === '/protected-route') {
    return new Error("Can't access a protected route")
  }
})
```
### The Listener interface
```typescript
interface Listeners {
	/**
	 * This function is called every time the `set` method is called.
	 * @param path the path passed to `set`.
	 * @param data the data passed to `set`.
	 * @param store the store instance.
	 */
	onset(path?: string, data?: any, store?: jStore): void | any;
	/**
	 * This function is called every time the `post` method is called.
	 * @param path the path passed to `post`.
	 * @param data the data passed to `post`.
	 * @param store the store instance.
	 */
	onpost(path?: string, data?: any, store?: jStore): void | any;
	/**
	 * This function is called every time the `get` method is called.
	 * @param path the path passed to `get`.
	 * @param store the store instance.
	 */
	onget(path?: string, store?: jStore): void | any;
	/**
	 * This function is called every time the `reset` method is called.
	 * @param store the store instance.
	 */
	onreset(store?: jStore): void | any;
	/**
	 * This function is called every time the `remove` method is called.
	 * @param path the path passed to `remove`.
	 * @param store the store instance.
	 */
	onremove(path?: string, store?: jStore): void | any;
	/**
	 * This function is called every time the `add` method is called.
	 * @param path the path passed to `add`.
	 * @param value the value passed to `add`.
	 * @param index the index passed to `add`.
	 * @param store the store instance.
	 */
	onadd(path?: string, value?: any, index?: number, store?: jStore): void | any;
}
```


### The _jStoreAsync_ class

This class is useful when you want to simulate real requests to a dabatase, to see how your UI handle promises.

All methods of this class behave exactly like the _jStore_ class, except that each method returns a promise.

```typescript
constructor(data: object, delay: number = 1000)
```

The `delay` argument is the time in milliseconds that each promise takes to resolve.

### Examples

```javascript

import { jStoreAsync } from '@j-theta/j-store'

const initialState = {
  cities: [
    'Imozumop',
    'Hiducuv',
    'Gowoju',
    'Retona',
    'Pirovo',
    'Uwlaji',
    'Emefetil',
  ],
  emails: [
    'kogrefenu@leezu.bn',
    'et@ravral.ly',
    'rul@tecot.us',
    'goga@biuka.bo',
    'ugwedtuj@idoubcef.nc',
  ]
}

const store = new jStoreAsync(initialState, 1200);

store.get('/cities')
  .then(res => console.log(res))
  /*
    [
      'Imozumop',
      'Hiducuv',
      'Gowoju',
      'Retona',
      'Pirovo',
      'Uwlaji',
      'Emefetil',
    ]
  */

 store.post('/cities', 'foo')
  .catch(e => console.log(e))
  // Error: "The path /cities is already been used"
```