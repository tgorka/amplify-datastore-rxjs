/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
import { AbstractGetApiAdapter, AbstractQueryApiAdapter } from "./api.adapter";
import { DataGetSuject } from "./data.get.suject";
import { DataQuerySuject } from "./data.query.suject";
export class SdkGetApiAdapter extends AbstractGetApiAdapter {
    constructor(fetchFunction, subscribeFunction, parseItemFunction) {
        super();
        this.fetchFunction = fetchFunction;
        this.subscribeFunction = subscribeFunction;
        this.parseItemFunction = parseItemFunction;
    }
    async fetch() {
        return this.fetchFunction(await this.id());
    }
    async subscribe(next) {
        return Promise.resolve(this?.subscribeFunction?.(await this.id())?.subscribe(next));
    }
    parseItem(data) {
        return this?.parseItemFunction?.(data) || data;
    }
}
export class SdkQueryApiAdapter extends AbstractQueryApiAdapter {
    constructor(fetchFunction, subscribeFunction, parseItemsFunction, parseNextTokenFunction, parseCurrentTokenFunction) {
        super();
        this.fetchFunction = fetchFunction;
        this.subscribeFunction = subscribeFunction;
        this.parseItemsFunction = parseItemsFunction;
        this.parseNextTokenFunction = parseNextTokenFunction;
        this.parseCurrentTokenFunction = parseCurrentTokenFunction;
    }
    async fetch() {
        return this.fetchFunction(await this.criteria(), await this.options());
    }
    async subscribe(next) {
        return Promise.resolve(this?.subscribeFunction?.(await this.criteria(), await this.options())?.subscribe(next));
    }
    isUsingTokenPagination() {
        return !!this.parseNextTokenFunction;
    }
    parseItems(data) {
        return this?.parseItemsFunction?.(data) ?? data;
    }
    parseNextToken(data) {
        return this?.parseNextTokenFunction?.(data) ?? null;
    }
    parseCurrentToken(data) {
        return this?.parseCurrentTokenFunction?.(data) ?? null;
    }
}
export class SdkGetSuject extends DataGetSuject {
    constructor(fetchFunction, subscribeFunction, parseItemFunction, id) {
        super(new SdkGetApiAdapter(fetchFunction, subscribeFunction, parseItemFunction), id);
    }
}
export class SdkQuerySuject extends DataQuerySuject {
    constructor(fetchFunction, subscribeFunction, parseItemsFunction, parseNextTokenFunction, parseCurrentTokenFunction, criteria, initialValue) {
        super(new SdkQueryApiAdapter(fetchFunction, subscribeFunction, parseItemsFunction, parseNextTokenFunction, parseCurrentTokenFunction), criteria, initialValue);
    }
}
//# sourceMappingURL=sdk.api.js.map