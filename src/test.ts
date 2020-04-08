import jStore from './index';

const store = new jStore({
	users: {
		'15': { name: 'Loretta Barnes', age: 26, email: 'jegede@hisric.mp' },
		'13': { name: 'Ada Taylor', age: 33, email: 'suommi@tozar.cc' },
		'43': { name: 'Andre Gonzalez', age: 36, email: 'odudsus@uvjup.tr' },
		'33': { name: 'Chester Burgess', age: 63, email: 'bipasese@kotobga.nl' }
	}
});
store.reset();

store.set('/foo/bar/hello/world/ei', { hello: 'world' });

console.log(store.get());
