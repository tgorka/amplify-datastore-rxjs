/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
import { AbstractGetApiAdapter, AbstractQueryApiAdapter, Item, Subscriber, Unsubscriber } from "./api.adapter";
import { DataGetSuject } from "./data.get.suject";
import { DataQuerySuject } from "./data.query.suject";
export declare class SdkGetApiAdapter<T, D = T> extends AbstractGetApiAdapter<T, D> {
    private fetchFunction;
    private subscribeFunction?;
    private parseItemFunction?;
    constructor(fetchFunction: (id: string) => Promise<D>, subscribeFunction?: (id: string) => Subscriber, parseItemFunction?: (data: D) => T);
    fetch(): Promise<D>;
    subscribe(next: () => Promise<void>): Promise<Unsubscriber>;
    parseItem(data: D): T;
}
export declare class SdkQueryApiAdapter<T, C, D = T[]> extends AbstractQueryApiAdapter<T, D> {
    private fetchFunction;
    private subscribeFunction?;
    private parseItemsFunction?;
    private parseNextTokenFunction?;
    private parseCurrentTokenFunction?;
    constructor(fetchFunction: (criteria: C, options: any) => Promise<D>, subscribeFunction?: (criteria: C, options: any) => Subscriber, parseItemsFunction?: (data: D) => T[], parseNextTokenFunction?: (data: D) => string, parseCurrentTokenFunction?: (data: D) => string);
    fetch(): Promise<D>;
    subscribe(next: () => Promise<void>): Promise<Unsubscriber>;
    isUsingTokenPagination(): boolean;
    parseItems(data: D): T[];
    parseNextToken(data: D): string;
    parseCurrentToken(data: D): string;
}
export declare class SdkGetSuject<T, D = T> extends DataGetSuject<T, D> {
    constructor(fetchFunction: (id: string) => Promise<D>, subscribeFunction?: (id: string) => Subscriber, parseItemFunction?: (data: D) => T, id?: string | null);
}
export declare class SdkQuerySuject<T extends Item, C = any, D = T[]> extends DataQuerySuject<T, C, D> {
    constructor(fetchFunction: (criteria: C, options: any) => Promise<D>, subscribeFunction?: (criteria: C, options: any) => Subscriber, parseItemsFunction?: (data: D) => T[], parseNextTokenFunction?: (data: D) => string, parseCurrentTokenFunction?: (data: D) => string, criteria?: C | null, initialValue?: T[]);
}
