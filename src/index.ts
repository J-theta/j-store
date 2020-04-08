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

export default class jStore {
	public data: object;
	public defaults: object;

	constructor(data: object) {
		this.defaults = data;
		if (data && this.isFirtsTime()) {
			this.data = data;
			localStorage.setItem('__JSTORE__', JSON.stringify(data));
		}
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
	 * Set new data in the given `path`
	 * @param path the path to set.
	 * @param neodata the new data.
	 */
	public set(path = '/', neodata: any) {
		if (path === '/') this.update(neodata);
		else {
			let data = this.get();
			let cdata = this.get();
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
				const foo: Function = new Function(
					'data',
					'cdata',
					`
          ${fbody}
          data${objectPaths.join('')} = cdata
          `
				);
				foo(data, cdata);
			}
			this.update(data);
		}
	}
	/**
	 * Reset the `store` for its *default* state.
	 */
	public reset() {
		localStorage.removeItem('__JSTORE__');
		this.update(this.defaults);
	}
	/**
	 * Remove a path from the `store`.
	 * @param path the path to remove.
	 */
	public remove(path: string) {
		let cdata = this.store;
		const paths = path.split('/').filter(a => a.trim() !== '');
		const lpath = paths.pop();
		paths.forEach(path => (cdata = cdata[path]));
		delete cdata[lpath];
		this.update(cdata);
	}
	/**
	 * Add new items to an array in the `store`
	 * @param path the array's path
	 * @param value the value to add
	 * @param index Optional - the index to add the value. If ommited, the value will be add at the end
	 */
	public add(path: string, value: any, index?: number) {
		let array: any[] = Object.values(this.get(path));
		if (index && index !== 0) array = [...array.slice(0, index), value, ...array.slice(index, array.length)];
		else if (index === 0) array.unshift(value);
		else array.push(value);
		this.set(path, array);
	}
	/**
	 * Test if a path exists in the `store`;
	 * @param path the path to test.
	 */
	public exists(path: string): boolean {
		try {
			return typeof this.get(path) !== 'undefined';
		} catch (e) {
			return false;
		}
	}
	/**
	 * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly change the data of an path that already exists.
	 * @param path the path of the new data. (must be a non existed path)
	 * @param data the data to add.
	 */
	public post(path: string, data: any) {
		if (this.exists(path)) throw new Error(`The path ${path} is already been used`);
		else this.set(path, data);
	}
}

class jStoreAsync {
	delay: number;
	store: jStore;
	constructor(data: object, delay: number = 1000) {
		this.delay = delay;
		this.store = new jStore(data);
	}

	private promise<T>(callback: () => any): Promise<T> {
		const delay = this.delay;
		return new Promise(res => setTimeout(() => res(callback()), delay));
	}
	/**
	 * Get data from store with the given `path`
	 * @param path the path to get the data.
	 * @param options an option object to determine the results
	 */
	public get(path: string, options?: options) {
		const { store, promise } = this;
		return promise<any>(() => store.get(path, options));
	}
	/**
	 * Set new data in the given `path`
	 * @param path the path to set.
	 * @param neodata the new data.
	 */
	public set(path: string, neodata: any) {
		const { store, promise } = this;
		return promise<void>(() => {
			store.set(path, neodata);
		});
	}
	/**
	 * Reset the `store` for its *default* state.
	 */
	public reset() {
		const { store, promise } = this;
		return promise<void>(() => store.reset());
	}
	/**
	 * Remove a path from the `store`.
	 * @param path the path to remove.
	 */
	public remove(path: string) {
		const { store, promise } = this;
		return promise<void>(() => store.remove(path));
	}
	/**
	 * Add new items to an array in the `store`
	 * @param path the array's path
	 * @param value the value to add
	 * @param index Optional - the index to add the value. If ommited, the value will be add at the end
	 */
	public add(path: string, value: any, index?: number) {
		const { store, promise } = this;
		return promise<void>(() => store.add(path, value, index));
	}
	/**
	 * Test if a path exists in the `store`;
	 * @param path the path to test.
	 */
	public exists(path: string) {
		const { store, promise } = this;
		return promise<boolean>(() => store.exists(path));
	}
	/**
	 * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly change the data of an path that already exists.
	 * @param path the path of the new data. (must be a non existed path)
	 * @param data the data to add.
	 */
	public post(path: string, data: any) {
		const { store, promise } = this;
		return promise<void>(() => store.post(path, data));
	}
}
