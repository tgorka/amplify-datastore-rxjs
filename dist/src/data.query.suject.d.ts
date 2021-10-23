/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
import { BehaviorSubject } from "rxjs";
import { AbstractQueryApiAdapter, Item } from "./api.adapter";
export declare class DataQuerySuject<T extends Item, C = any, D = any> extends BehaviorSubject<T[]> {
    private api;
    private criteria?;
    private isFinished;
    private isInited;
    private isLoading;
    private currentToken;
    private nextToken;
    private page;
    private limit;
    private dataStoreSubscription;
    private postDataBatchTrigger;
    private postFetchTrigger;
    private dataChangedTrigger;
    constructor(api: AbstractQueryApiAdapter<T, D> | null, criteria?: C | null, initialValue?: T[]);
    init(criteria?: C | null): Promise<void>;
    setPostFetchTrigger(fn: () => void): void;
    setDataChangedTrigger(fn: () => void): void;
    setPostDataBatchTrigger(fn: (batch: D) => Promise<D>): void;
    scrollNextEvent(event: any): Promise<void>;
    trackBy(index: number, item: T): string;
    private clear;
    private loadNext;
    private fetch;
    private appendItems;
    private subscribeDataStore;
    private unsubscribeDataStore;
    unsubscribe(): void;
}
