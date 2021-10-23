/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
import { BehaviorSubject } from "rxjs";
import { AbstractGetApiAdapter } from "./api.adapter";
export declare class DataGetSuject<T, D = T> extends BehaviorSubject<T> {
    private api;
    private id?;
    private isInited;
    private isLoading;
    private dataStoreSubscription;
    private postDataUpdateTrigger;
    private postFetchTrigger;
    constructor(api: AbstractGetApiAdapter<T, D> | null, id?: string | null, initialValue?: T);
    setPostFetchTrigger(fn: () => void): void;
    setPostDataUpdateTrigger(fn: (update: D) => Promise<D>): void;
    init(id?: string | null): Promise<void>;
    private clear;
    private load;
    private fetch;
    private subscribeDataStore;
    private unsubscribeDataStore;
    unsubscribe(): void;
}
