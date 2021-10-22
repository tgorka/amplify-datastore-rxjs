/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors. 
 * All rights reserved. MIT license.
 */
import { 
    AbstractGetApiAdapter, 
    AbstractQueryApiAdapter, 
    Item, 
    Subscriber, 
    Unsubscriber 
} from "./api.adapter";
import { DataGetSuject } from "./data.get.suject";
import { DataQuerySuject } from "./data.query.suject";


export class SdkGetApiAdapter<T, D = T> extends AbstractGetApiAdapter<T, D> {
    constructor(
        private fetchFunction: (id: string) => Promise<D>,
        private subscribeFunction?: (id: string) => Subscriber,
        private parseItemFunction?: (data: D) => T,
    ) {
        super();
    }

    async fetch(): Promise<D> {
        return this.fetchFunction(await this.id());
    }

    async subscribe(next: () => Promise<void>): Promise<Unsubscriber> {
        return Promise.resolve(this?.subscribeFunction?.(await this.id())?.subscribe(next));
    }

    parseItem(data: D): T {
        return this?.parseItemFunction?.(data) || data as any;
    }
}


export class SdkQueryApiAdapter<T, C, D = T[]> extends AbstractQueryApiAdapter<T, D> {
    constructor(
        private fetchFunction: (criteria: C, options: any) => Promise<D>,
        private subscribeFunction?: (criteria: C, options: any) => Subscriber,
        private parseItemsFunction?: (data: D) => T[],
        private parseNextTokenFunction?: (data: D) => string,
        private parseCurrentTokenFunction?: (data: D) => string,
    ) {
        super();
    }

    async fetch(): Promise<D> {
        return this.fetchFunction(await this.criteria(), await this.options());
    }

    async subscribe(next: () => Promise<void>): Promise<Unsubscriber> {
        return Promise.resolve(this?.subscribeFunction?.(
            await this.criteria(), await this.options())?.subscribe(next));
    }

    isUsingTokenPagination(): boolean {
        return !!this.parseNextTokenFunction;
    }

    parseItems(data: D): T[] {
        return this?.parseItemsFunction?.(data) ?? data as any;
    }

    parseNextToken(data: D): string {
        return this?.parseNextTokenFunction?.(data) ?? null;
    }

    parseCurrentToken(data: D): string {
        return this?.parseCurrentTokenFunction?.(data) ?? null;
    }
}

export class SdkGetSuject<T, D = T> extends DataGetSuject<T, D> {
    constructor(
        fetchFunction: (id: string) => Promise<D>,
        subscribeFunction?: (id: string) => Subscriber,
        parseItemFunction?: (data: D) => T,
        id?: string | null
    ) {
        super(new SdkGetApiAdapter<T, D>(fetchFunction, subscribeFunction, parseItemFunction), id);
    }
}

export class SdkQuerySuject<T extends Item, C = any, D = T[]> extends DataQuerySuject<T, C, D> {
    constructor(
        fetchFunction: (criteria: C, options: any) => Promise<D>,
        subscribeFunction?: (criteria: C, options: any) => Subscriber,
        parseItemsFunction?: (data: D) => T[],
        parseNextTokenFunction?: (data: D) => string,
        parseCurrentTokenFunction?: (data: D) => string,
        criteria?: C | null,
        initialValue?: T[]
    ) {
        super(new SdkQueryApiAdapter<T, C, D>(
            fetchFunction, 
            subscribeFunction, 
            parseItemsFunction,
            parseNextTokenFunction,
            parseCurrentTokenFunction
        ), criteria, initialValue);
    }
}
