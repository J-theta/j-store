export default class jStore {
    constructor(data) {
        this.defaults = data;
        if (data && this.isFirtsTime()) {
            this.data = data;
            localStorage.setItem('__JSTORE__', JSON.stringify(data));
        }
    }
    /**
     * Check if is the store already exists
     */
    isFirtsTime() {
        return !localStorage.getItem('__JSTORE__');
    }
    /**
     * Get the current `store` data
     */
    get store() {
        return JSON.parse(localStorage.getItem('__JSTORE__'));
    }
    /**
     * This method is used internally to update the `store` with new data.
     * @param data
     */
    update(data) {
        this.data = data;
        localStorage.setItem('__JSTORE__', JSON.stringify(data));
    }
    /**
     * Get data from store with the given `path`
     * @param path the path to get the data.
     * @param options an option object to determine the results
     */
    get(path = '/', options) {
        if (path === '/')
            return this.store;
        else {
            const store = this.store;
            const paths = path.split('/').filter(a => a.trim() !== '');
            let res = paths.reduce((res, path) => res[path], store);
            if (options) {
                const { where, orderBy, desc, asc, limit } = options;
                if (where)
                    res = Object.values(res).filter(where);
                if (limit) {
                    res = Object.values(res);
                    res.length = limit;
                }
                if (orderBy)
                    res = Object.values(res).sort((a, b) => {
                        if (a[orderBy] > b[orderBy])
                            return desc ? -1 : 1;
                        else
                            return desc ? 1 : -1;
                        return 0;
                    });
                if (asc)
                    res = Object.values(res).sort((a, b) => {
                        if (a < b)
                            return typeof a === 'string' ? -1 : 1;
                        else
                            return typeof a === 'string' ? 1 : -1;
                        return 0;
                    });
                if (desc)
                    res = Object.values(res).sort((a, b) => {
                        if (a > b)
                            return typeof a === 'string' ? -1 : 1;
                        else
                            return typeof a === 'string' ? 1 : -1;
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
    set(path = '/', neodata) {
        if (path === '/')
            this.update(neodata);
        else {
            let data = this.get();
            let cdata = this.get();
            const paths = path.split('/').filter(a => a.trim() !== '');
            if (paths.length === 1)
                data[paths[0]] = neodata;
            else {
                const lpath = paths.pop();
                paths.forEach(path => {
                    if (!cdata[path])
                        cdata[path] = {};
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
                const update = new Function('data', 'cdata', `
          ${fbody}
          data${objectPaths.join('')} = cdata
          `);
                update(data, cdata);
            }
            this.update(data);
        }
    }
    /**
     * Reset the `store` for its *default* state.
     */
    reset() {
        localStorage.removeItem('__JSTORE__');
        this.update(this.defaults);
    }
    /**
     * Remove a path from the `store`.
     * @param path the path to remove.
     */
    remove(path) {
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
    add(path, value, index) {
        let array = Object.values(this.get(path));
        if (index && index !== 0)
            array = [...array.slice(0, index), value, ...array.slice(index, array.length)];
        else if (index === 0)
            array.unshift(value);
        else
            array.push(value);
        this.set(path, array);
    }
    /**
     * Test if a path exists in the `store`;
     * @param path the path to test.
     */
    exists(path) {
        try {
            return typeof this.get(path) !== 'undefined';
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly change the data of an path that already exists.
     * @param path the path of the new data. (must be a non existed path)
     * @param data the data to add.
     */
    post(path, data) {
        if (this.exists(path))
            throw new Error(`The path ${path} is already been used`);
        else
            this.set(path, data);
    }
}
/**
 * This class is useful when you want to simulate real requests to a dabatase, to see how your UI handle promises.
 *
 * Like real databases, Theses requests always returns a promise.
 */
export class jStoreAsync {
    /**
     * Create a new database simulator.
     * @param data the initial state
     * @param delay the delay of each request
     */
    constructor(data, delay = 1000) {
        this.delay = delay;
        this.store = new jStore(data);
    }
    promise(callback, delay = 1000) {
        return new Promise((res, rej) => setTimeout(() => {
            try {
                res(callback());
            }
            catch (e) {
                rej(e);
            }
        }, delay));
    }
    /**
     * Get data from store with the given `path`
     * @param path the path to get the data.
     * @param options an option object to determine the results
     */
    get(path = '/', options) {
        const { store, promise, delay } = this;
        return promise(() => store.get(path, options), delay);
    }
    /**
     * Set new data in the given `path`
     * @param path the path to set.
     * @param neodata the new data.
     */
    set(path, neodata) {
        const { store, promise, delay } = this;
        return promise(() => {
            store.set(path, neodata);
        }, delay);
    }
    /**
     * Reset the `store` for its *default* state.
     */
    reset() {
        const { store, promise, delay } = this;
        return promise(() => store.reset(), delay);
    }
    /**
     * Remove a path from the `store`.
     * @param path the path to remove.
     */
    remove(path) {
        const { store, promise, delay } = this;
        return promise(() => store.remove(path), delay);
    }
    /**
     * Add new items to an array in the `store`
     * @param path the array's path
     * @param value the value to add
     * @param index Optional - the index to add the value. If ommited, the value will be add at the end
     */
    add(path, value, index) {
        const { store, promise, delay } = this;
        return promise(() => store.add(path, value, index), delay);
    }
    /**
     * Test if a path exists in the `store`;
     * @param path the path to test.
     */
    exists(path) {
        const { store, promise, delay } = this;
        return promise(() => store.exists(path), delay);
    }
    /**
     * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly change the data of an path that already exists.
     * @param path the path of the new data. (must be a non existed path)
     * @param data the data to add.
     */
    post(path, data) {
        const { store, promise, delay } = this;
        return promise(() => store.post(path, data), delay);
    }
}
