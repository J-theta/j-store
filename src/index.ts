interface options {
	/** A function to filter the results */
	where?: (value: any, index: number) => boolean;
	/** a string property to order the results */
	orderBy?: string;
	/** Determine if the result order will be 'descending' */
	desc?: boolean;
	/** Determine if the result order will be 'ascending' */
	asc?: boolean;
	/** an integer to limit the results */
	limit?: number;
}

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

type Method = 'get' | 'set' | 'post' | 'remove' | 'reset' | 'add';

export default class jStore {
	public data: object;
	public defaults: object;
	private listeners: Partial<Listeners>;

	constructor(data: object, listeners?: Partial<Listeners>) {
		this.defaults = data;
		this.listeners = listeners || {};
		if (data && this.isFirtsTime()) {
			this.data = data;
			localStorage.setItem('__JSTORE__', JSON.stringify(data));
		}
	}
	/**
	 * Add a `event listener` to the store.
	 * @param method the method to listen.
	 * @param handler the callback function.
	 */
	public on(method: Method, handler: (...args: any[]) => void) {
		this.listeners['on' + method] = handler;
	}
	/**
	 * Remove a listener of a method.
	 * @param method the method to remove the listener.
	 */
	public clearListener(method: Method) {
		delete this.listeners[method];
	}
	/**
	 * Check if is the store already exists
	 */
	private isFirtsTime(): boolean {
		return !localStorage.getItem('__JSTORE__');
	}
	/**
	 * Get the current `store` data
	 */
	public get store(): object {
		return JSON.parse(localStorage.getItem('__JSTORE__'));
	}
	/**
	 * This method is used internally to update the `store` with new data.
	 * @param data
	 */
	private update(data: object) {
		this.data = data;
		localStorage.setItem('__JSTORE__', JSON.stringify(data));
	}
	/**
	 * Get data from store with the given `path`
	 * @param path the path to get the data.
	 * @param options an option object to determine the results
	 */
	public get(path = '/', options?: options): any {
		const { onget } = this.listeners;
		let response: any;
		if (onget) response = onget(path, this);
		if (response) return response;
		if (path === '/') return this.store;
		else {
			const store = this.store;
			const paths = path.split('/').filter(a => a.trim() !== '');
			let res: any[] = paths.reduce((res, path) => res[path], store);
			if (options) {
				const { where, orderBy, desc, asc, limit } = options;
				if (where) res = Object.values(res).filter(where);
				if (limit) {
					res = Object.values(res);
					res.length = limit;
				}
				if (orderBy)
					res = Object.values(res).sort((a, b) => {
						if (a[orderBy] > b[orderBy]) return desc ? -1 : 1;
						else return desc ? 1 : -1;
						return 0;
					});
				if (asc)
					res = Object.values(res).sort((a, b) => {
						if (a < b) return typeof a === 'string' ? -1 : 1;
						else return typeof a === 'string' ? 1 : -1;
						return 0;
					});
				if (desc)
					res = Object.values(res).sort((a, b) => {
						if (a > b) return typeof a === 'string' ? -1 : 1;
						else return typeof a === 'string' ? 1 : -1;
						return 0;
					});
			}
			return res;
		}
	}
	/**
	 * Set new data in the given `path`.
	 *
	 * `Note:` If the path already exists, then its data will be override.
	 * @param path the path to set.
	 * @param neodata the new data.
	 */
	public set(path = '/', neodata: any): Error | void {
		const { onset } = this.listeners;
		let response: any;
		if (onset) response = onset(path, neodata, this);
		if (response) return response;
		if (path === '/') this.update(neodata);
		else {
			let data = this.store;
			let cdata = this.store;
			const paths = path.split('/').filter(a => a.trim() !== '');
			if (paths.length === 1) data[paths[0]] = neodata;
			else {
				const lpath = paths.pop();
				paths.forEach(path => {
					if (!cdata[path]) cdata[path] = {};
					cdata = cdata[path];
				});
				cdata[lpath] = neodata;
				let objectPaths = paths.map(p => `['${p}']`);
				let lpaths = objectPaths.map((p, i) => objectPaths.slice(0, i)).filter(a => a.length > 0);
				let fbody = lpaths
					.map(p => {
						let d = `data${p.join('')}`;
						return `${d} = ${d} || {}`;
					})
					.join(';\n');
				const update: Function = new Function(
					'data',
					'cdata',
					`
          ${fbody}
          data${objectPaths.join('')} = cdata
          `
				);
				update(data, cdata);
			}
			this.update(data);
		}
	}
	/**
	 * Reset the `store` for its *default* state.
	 */
	public reset() {
		const { onreset } = this.listeners;
		if (onreset) onreset(this);
		localStorage.removeItem('__JSTORE__');
		this.update(this.defaults);
	}
	/**
	 * Remove a path from the `store`.
	 * @param path the path to remove.
	 */
	public remove(path: string) {
		const { onremove, onset } = this.listeners;
		let response: any;
		if (onremove) response = onremove(path, this);
		if (response) return response;
		let cdata = this.store;
		const paths = path.split('/').filter(a => a.trim() !== '');
		const lpath = paths.pop();
		paths.forEach(path => (cdata = cdata[path]));
		delete cdata[lpath];
		delete this.listeners['onset'];
		this.set(paths.join('/'), cdata);
		this.listeners['onset'] = onset;
	}
	/**
	 * Add new items to an array in the `store`
	 * @param path the array's path
	 * @param value the value to add
	 * @param index Optional - the index to add the value. If ommited, the value will be add at the end
	 */
	public add(path: string, value: any, index?: number) {
		const { onadd, onset } = this.listeners;
		let response: any;
		if (onadd) response = onadd(path, value, index || 0, this);
		if (response) return response;
		let array: any[] = Object.values(this.get(path));
		if (index && index !== 0) array = [...array.slice(0, index), value, ...array.slice(index, array.length)];
		else if (index === 0) array.unshift(value);
		else array.push(value);
		delete this.listeners['onset'];
		this.set(path, array);
		this.listeners['onset'] = onset;
	}
	/**
	 * Test if a path exists in the `store`;
	 * @param path the path to test.
	 */
	public exists(path: string): boolean {
		const { onget } = this.listeners;
		delete this.listeners['onget'];
		try {
			let res = typeof this.get(path) !== 'undefined';
			this.listeners['onget'] = onget;
			return res;
		} catch (e) {
			return false;
		}
	}
	/**
	 * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly override the data of an path that already exists.
	 * @param path the path of the new data. (must be a non existed path)
	 * @param data the data to add.
	 */
	public post(path: string, data: any): void | Error {
		const { onpost, onset } = this.listeners;
		let response: any;
		if (onpost) response = onpost(path, data, this);
		if (response) return response;
		if (this.exists(path)) throw new Error(`The path ${path} is already been used`);
		if (onset) delete this.listeners['onset'];
		else this.set(path, data);
		this.listeners['onset'] = onset;
	}
}
/**
 * This class is useful when you want to simulate real requests to a dabatase, to see how your UI handle promises.
 *
 * All methods of this class behave exactly like the `jStore` class, except that each method returns a promise.
 */
export class jStoreAsync {
	delay: number;
	store: jStore;
	/**
	 * Create a new database simulator.
	 * @param data the initial state
	 * @param delay the delay of each request in `milliseconds`
	 */
	constructor(data: object, delay: number = 1000) {
		this.delay = delay;
		this.store = new jStore(data);
	}

	private promise<T>(callback: () => any, delay = 1000): Promise<T> {
		return new Promise((res, rej) =>
			setTimeout(() => {
				try {
					res(callback());
				} catch (e) {
					rej(e);
				}
			}, delay)
		);
	}
	/**
	 * Get data from store with the given `path`
	 * @param path the path to get the data.
	 * @param options an option object to determine the results
	 */
	public get(path: string = '/', options?: options) {
		const { store, promise, delay } = this;
		return promise<any>(() => store.get(path, options), delay);
	}
	/**
	 * Set new data in the given `path`
	 * @param path the path to set.
	 * @param neodata the new data.
	 */
	public set(path: string, neodata: any) {
		const { store, promise, delay } = this;
		return promise<void>(() => {
			store.set(path, neodata);
		}, delay);
	}
	/**
	 * Reset the `store` for its *default* state.
	 */
	public reset() {
		const { store, promise, delay } = this;
		return promise<void>(() => store.reset(), delay);
	}
	/**
	 * Remove a path from the `store`.
	 * @param path the path to remove.
	 */
	public remove(path: string) {
		const { store, promise, delay } = this;
		return promise<void>(() => store.remove(path), delay);
	}
	/**
	 * Add new items to an array in the `store`
	 * @param path the array's path
	 * @param value the value to add
	 * @param index Optional - the index to add the value. If ommited, the value will be add at the end
	 */
	public add(path: string, value: any, index?: number) {
		const { store, promise, delay } = this;
		return promise<void>(() => store.add(path, value, index), delay);
	}
	/**
	 * Test if a path exists in the `store`;
	 * @param path the path to test.
	 */
	public exists(path: string) {
		const { store, promise, delay } = this;
		return promise<boolean>(() => store.exists(path), delay);
	}
	/**
	 * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly change the data of an path that already exists.
	 * @param path the path of the new data. (must be a non existed path)
	 * @param data the data to add.
	 */
	public post(path: string, data: any) {
		const { store, promise, delay } = this;
		return promise<void>(() => store.post(path, data), delay);
	}
}
