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
declare type Method = 'get' | 'set' | 'post' | 'remove' | 'reset' | 'add';
export default class jStore {
    data: object;
    defaults: object;
    private listeners;
    constructor(data: object, listeners?: Partial<Listeners>);
    /**
     * Add a `event listener` to the store.
     * @param method the method to listen.
     * @param handler the callback function.
     */
    on(method: Method, handler: (...args: any[]) => void): void;
    /**
     * Remove a listener of a method.
     * @param method the method to remove the listener.
     */
    clearListener(method: Method): void;
    /**
     * Check if is the store already exists
     */
    private isFirtsTime;
    /**
     * Get the current `store` data
     */
    get store(): object;
    /**
     * This method is used internally to update the `store` with new data.
     * @param data
     */
    private update;
    /**
     * Get data from store with the given `path`
     * @param path the path to get the data.
     * @param options an option object to determine the results
     */
    get(path?: string, options?: options): any;
    /**
     * Set new data in the given `path`.
     *
     * `Note:` If the path already exists, then its data will be override.
     * @param path the path to set.
     * @param neodata the new data.
     */
    set(path: string, neodata: any): Error | void;
    /**
     * Reset the `store` for its *default* state.
     */
    reset(): void;
    /**
     * Remove a path from the `store`.
     * @param path the path to remove.
     */
    remove(path: string): any;
    /**
     * Add new items to an array in the `store`
     * @param path the array's path
     * @param value the value to add
     * @param index Optional - the index to add the value. If ommited, the value will be add at the end
     */
    add(path: string, value: any, index?: number): any;
    /**
     * Test if a path exists in the `store`;
     * @param path the path to test.
     */
    exists(path: string): boolean;
    /**
     * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly override the data of an path that already exists.
     * @param path the path of the new data. (must be a non existed path)
     * @param data the data to add.
     */
    post(path: string, data: any): void | Error;
}
/**
 * This class is useful when you want to simulate real requests to a dabatase, to see how your UI handle promises.
 *
 * All methods of this class behave exactly like the `jStore` class, except that each method returns a promise.
 */
export declare class jStoreAsync {
    delay: number;
    store: jStore;
    /**
     * Create a new database simulator.
     * @param data the initial state
     * @param delay the delay of each request in `milliseconds`
     */
    constructor(data: object, delay?: number);
    private promise;
    /**
     * Get data from store with the given `path`
     * @param path the path to get the data.
     * @param options an option object to determine the results
     */
    get(path?: string, options?: options): Promise<any>;
    /**
     * Set new data in the given `path`
     * @param path the path to set.
     * @param neodata the new data.
     */
    set(path: string, neodata: any): Promise<void>;
    /**
     * Reset the `store` for its *default* state.
     */
    reset(): Promise<void>;
    /**
     * Remove a path from the `store`.
     * @param path the path to remove.
     */
    remove(path: string): Promise<void>;
    /**
     * Add new items to an array in the `store`
     * @param path the array's path
     * @param value the value to add
     * @param index Optional - the index to add the value. If ommited, the value will be add at the end
     */
    add(path: string, value: any, index?: number): Promise<void>;
    /**
     * Test if a path exists in the `store`;
     * @param path the path to test.
     */
    exists(path: string): Promise<boolean>;
    /**
     * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly change the data of an path that already exists.
     * @param path the path of the new data. (must be a non existed path)
     * @param data the data to add.
     */
    post(path: string, data: any): Promise<void>;
}
export {};
