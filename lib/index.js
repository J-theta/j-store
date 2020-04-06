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
     * @param data the new data.
     */
    set(path = '/', data) {
        if (path === '/')
            this.update(data);
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
}
