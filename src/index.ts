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
	 * @param data the new data.
	 */
	public set(path = '/', data: any) {
		if (path === '/') this.update(data);
		else {
			let cdata = this.store;
			const paths = path.split('/').filter(a => a.trim() !== '');
			const lpath = paths.pop();
			paths.forEach(path => (cdata = cdata[path]));
			cdata[lpath] = data;
			this.update(cdata);
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
}
