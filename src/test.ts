import jStore, { jStoreAsync } from './index';

const store = new jStoreAsync({
	users: {
		'15': { name: 'Loretta Barnes', age: 26, email: 'jegede@hisric.mp' },
		'13': { name: 'Ada Taylor', age: 33, email: 'suommi@tozar.cc' },
		'43': { name: 'Andre Gonzalez', age: 36, email: 'odudsus@uvjup.tr' },
		'33': { name: 'Chester Burgess', age: 63, email: 'bipasese@kotobga.nl' }
	}
});

store.get('/users/15').then(console.log);

store
	.post('/users/15', { hello: 'world' })
	.then(() => console.log('users has been updated'))
	.catch(e => console.log(e));

store.exists('/users/97').then(res => console.log('The user 97 exists = ' + res));
