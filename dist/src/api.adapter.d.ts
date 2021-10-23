/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
export interface Item {
    id: string;
    _version?: number | string;
}
export interface Unsubscriber {
    unsubscribe(): void;
}
export interface Subscriber {
    subscribe(next: () => Promise<void>): Unsubscriber;
}
export interface ApiAdapter<D> {
    fetch(): Promise<D>;
    subscribe(next: () => Promise<void>): Promise<Unsubscriber>;
}
export interface GetApiAdapter<T, D> extends ApiAdapter<D> {
    id(): Promise<string>;
    parseItem(data: D): T;
}
export interface QueryApiAdapter<T, D> extends ApiAdapter<D> {
    criteria(): Promise<any>;
    options(): Promise<any>;
    isUsingTokenPagination(): boolean;
    parseItems(data: D): T[];
    parseNextToken(data: D): string;
    parseCurrentToken(data: D): string;
}
export declare abstract class AbstractGetApiAdapter<T, D> implements GetApiAdapter<T, D> {
    private idFetcher;
    setIdFetcher(idFetcher: () => Promise<string>): void;
    id(): Promise<string>;
    abstract fetch(): Promise<D>;
    abstract subscribe(next: () => Promise<void>): Promise<Unsubscriber>;
    abstract parseItem(data: D): T;
}
export declare abstract class AbstractQueryApiAdapter<T, D> implements QueryApiAdapter<T, D> {
    private criteriaFetcher;
    private optionsFetcher;
    setCriteriaFetcher(criteriaFetcher: () => Promise<any>): void;
    setOptionsFetcher(optionsFetcher: () => Promise<any>): void;
    criteria(): Promise<any>;
    options(): Promise<any>;
    abstract fetch(): Promise<D>;
    abstract subscribe(next: () => Promise<void>): Promise<Unsubscriber>;
    abstract isUsingTokenPagination(): boolean;
    abstract parseItems(data: D): T[];
    abstract parseNextToken(data: D): string;
    abstract parseCurrentToken(data: D): string;
}
