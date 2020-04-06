import jStore from './index';

const store = new jStore({
	users: {
		'15': { name: 'Loretta Barnes', age: 26, email: 'jegede@hisric.mp' },
		'13': { name: 'Ada Taylor', age: 33, email: 'suommi@tozar.cc' },
		'43': { name: 'Andre Gonzalez', age: 36, email: 'odudsus@uvjup.tr' },
		'33': { name: 'Chester Burgess', age: 63, email: 'bipasese@kotobga.nl' }
	}
});
// store.reset();

// console.log(store.get());

store.set('/foo/bar/5', { hello: 'world' });

// store.set('/users/45', { name: 'Helena Henry', age: 45, email: 'puszeb@dil.dz' });

console.log(store.get('/'));
