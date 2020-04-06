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
     * @param data the new data.
     */
    set(path: string, data: any): void;
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
}
export {};
