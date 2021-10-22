/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors. 
 * All rights reserved. MIT license.
 */


export interface Item {
    id: string,
    _version?: number | string,
}

export interface Unsubscriber {
    unsubscribe(): void;
}

export interface Subscriber {
    subscribe(next: () => Promise<void>): Unsubscriber
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
    criteria(): Promise<any>
    options(): Promise<any>;
    isUsingTokenPagination(): boolean;
    parseItems(data: D): T[];
    parseNextToken(data: D): string;
    parseCurrentToken(data: D): string;
}

export abstract class AbstractGetApiAdapter<T, D> implements GetApiAdapter<T, D> {
    private idFetcher: () => Promise<string> = () => { throw new Error("Call setIdFetcher() before usage."); }

    setIdFetcher(idFetcher: () => Promise<string>): void {
        this.idFetcher = idFetcher;
    }

    async id(): Promise<string> {
        return this.idFetcher();
    }

    abstract fetch(): Promise<D>;
    abstract subscribe(next: () => Promise<void>): Promise<Unsubscriber>;
    abstract parseItem(data: D): T;
}

export abstract class AbstractQueryApiAdapter<T, D> implements QueryApiAdapter<T, D> {
    private criteriaFetcher: () => Promise<any> = () => { throw new Error("Call setCriteriaFetcher() before usage."); }
    private optionsFetcher: () => Promise<any> = () => { throw new Error("Call setOptionsFetcher() before usage."); }

    setCriteriaFetcher(criteriaFetcher: () => Promise<any>): void {
        this.criteriaFetcher = criteriaFetcher;
    }

    setOptionsFetcher(optionsFetcher: () => Promise<any>): void {
        this.optionsFetcher = optionsFetcher;
    }

    criteria(): Promise<any> {
        return this.criteriaFetcher();
    }

    options(): Promise<any> {
        return this.optionsFetcher();
    }

    abstract fetch(): Promise<D>;
    abstract subscribe(next: () => Promise<void>): Promise<Unsubscriber>;
    abstract isUsingTokenPagination(): boolean;
    abstract parseItems(data: D): T[];
    abstract parseNextToken(data: D): string;
    abstract parseCurrentToken(data: D): string;
}
