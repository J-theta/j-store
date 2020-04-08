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
    data: object;
    defaults: object;
    constructor(data: object);
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
     * Set new data in the given `path`
     * @param path the path to set.
     * @param neodata the new data.
     */
    set(path: string, neodata: any): void;
    /**
     * Reset the `store` for its *default* state.
     */
    reset(): void;
    /**
     * Remove a path from the `store`.
     * @param path the path to remove.
     */
    remove(path: string): void;
    /**
     * Add new items to an array in the `store`
     * @param path the array's path
     * @param value the value to add
     * @param index Optional - the index to add the value. If ommited, the value will be add at the end
     */
    add(path: string, value: any, index?: number): void;
    /**
     * Test if a path exists in the `store`;
     * @param path the path to test.
     */
    exists(path: string): boolean;
    /**
     * Like the `set` method, this method add new data in the `store`, but only if the path does not already exists. This is useful when you want to add new data without accidentaly change the data of an path that already exists.
     * @param path the path of the new data. (must be a non existed path)
     * @param data the data to add.
     */
    post(path: string, data: any): void;
}
/**
 * This class is useful when you want to simulate real requests to a dabatase, to see how your UI handle promises.
 *
 * Like real databases, Theses requests always returns a promise.
 */
export declare class jStoreAsync {
    delay: number;
    store: jStore;
    /**
     * Create a new database simulator.
     * @param data the initial state
     * @param delay the delay of each request
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
