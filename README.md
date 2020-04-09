# j-Store

Use the localStorage like a small database.

> This package was created for me to use in my own projects,
> but i thought that will be useful for others to use

See this simple [Todo App](https://todo-app-self.now.sh/) that uses jStore.

__Some warnings__
1. This project is still in development, so pardon for any bugs and errors.
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

### Properties

1. __store__ - Get the current `store` data
  
### Methods

1. __get__ - Get data from store with the given `path`
```typescript
public get(path?: string, options?: options): any;
```
> Example:
```javascript
const users = store.get('/users')
```
##
2. __set__ - Set new data in the given `path`
```typescript
public set(path: string, data: any): void;
```
> Example:
```javascript
store.set('/users/17', { age: 25, name: "Janie Lewis" } )
```
##
3. __post__ - Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly override the data of an path that already exists.
```typescript
public post(path: string, data: any): void;
```
> Example:
```javascript
// This is fine because the path '/hello' does not exists yet
store.post('/hello', [ 'world' ] )
// But this will cause an error, because the path '/users' already exists
store.post('/users', { foo: 'bar' } )
```
##
4. __reset__ - Reset the `store` to its *default* state.
```typescript
public reset(): void;
```
> Example:
```javascript
store.reset() // the store will be transform to its default state
```
##
5. __remove__ - Remove a path from the `store`.
```typescript
public remove(path: string): void;
```
> Example:
```javascript
store.get('/hello') // [ 'world' ]

store.remove('/hello') // remove the '/hello' path

store.get('/hello') // undefined
```
##
6. __add__ - Add new items to an array in the `store`.
```typescript
public add(path: string, value: any, index?: number): void;
```
> Example:
```javascript
store.add('/cities', 'Litralun');
store.get('/cities')
/*
[
  "Medufpuh" ,  
  "Oguagwon" ,  
  "Wuhaful"  ,  
  "Pitburi"  ,  
  "Mimekiras",  
  "Suvvakpo" ,
  "Litralun" ,  
 ]
 */
```
> Add item in specific index
```javascript
store.add('/cities', 'Litralun', 1);
store.get('/cities')
/*
[
  0 -> "Medufpuh",
  1 -> "Litralun",
  2 -> "Oguagwon",
  3 -> "Wuhaful",
  4 -> "Pitburi",
  5 -> "Mimekiras",
  6 -> "Suvvakpo",
 ]
 */
```
##
7. __exists__ - Test if a path exists in the `store`
```typescript
public add(path: string, value: any, index?: number): void;
```
> Example:
```javascript
store.exists('/users') // true

store.exists('/Fejinka') // false
```
##

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