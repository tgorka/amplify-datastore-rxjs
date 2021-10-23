/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
import { BehaviorSubject } from "rxjs";
export class DataQuerySuject extends BehaviorSubject {
    constructor(api, criteria, initialValue) {
        super(initialValue || []);
        this.api = api;
        this.criteria = criteria;
        this.isFinished = false;
        this.isInited = false;
        this.isLoading = false;
        this.currentToken = null;
        this.nextToken = null;
        this.page = 0;
        this.limit = 10;
        this.dataStoreSubscription = null;
        this.postDataBatchTrigger = async (batch) => batch;
        this.postFetchTrigger = () => { };
        this.dataChangedTrigger = () => { };
        this.api.setCriteriaFetcher(async () => this.criteria);
        this.api.setOptionsFetcher(async () => ({
            page: this.page,
            limit: this.limit,
            currentToken: this.currentToken,
            nextToken: this.nextToken,
        }));
    }
    async init(criteria) {
        this.criteria = criteria || this.criteria;
        this.isInited = true;
        await this.clear();
        await this.loadNext();
    }
    setPostFetchTrigger(fn) {
        this.postFetchTrigger = fn;
    }
    setDataChangedTrigger(fn) {
        this.dataChangedTrigger = fn;
    }
    setPostDataBatchTrigger(fn) {
        this.postDataBatchTrigger = fn;
    }
    async scrollNextEvent(event) {
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (event && event.target && this.isFinished) {
            event.target.disabled = true;
            event.target.complete();
            return;
        }
        // load the data down to the list
        await this.loadNext();
        // finish the event for infinitive scroll
        event?.target?.complete();
    }
    trackBy(index, item) {
        return `${item.id}#${item?._version}`;
    }
    async clear() {
        this.next([]);
        this.unsubscribeDataStore();
        this.page = 0;
        this.nextToken = null;
        this.currentToken = null;
        this.isLoading = false;
        this.isFinished = false;
    }
    async loadNext() {
        if (this.isLoading || !this.isInited) {
            return;
        }
        try {
            this.isLoading = true;
            const rawData = await this.fetch();
            const data = this.api.parseItems(rawData);
            this.nextToken = this.api.parseNextToken(rawData);
            this.currentToken = this.api.parseCurrentToken(rawData);
            if (this.api.isUsingTokenPagination()) {
                this.page++;
                this.appendItems(data);
                if (!this.nextToken) {
                    this.isFinished = true;
                }
            }
            else {
                if (data.length > 0) {
                    this.page++;
                    this.appendItems(data);
                }
                else {
                    this.isFinished = true;
                }
            }
        }
        finally {
            this.isLoading = false;
        }
    }
    async fetch() {
        if (this.page === 0 && this.currentToken === null && this.nextToken === null) {
            await this.subscribeDataStore();
        }
        return this.postDataBatchTrigger(await this.api.fetch());
    }
    async appendItems(data) {
        this.next(this.getValue().concat(data));
        this.postFetchTrigger();
    }
    async subscribeDataStore() {
        this.dataStoreSubscription = await this.api.subscribe(async () => {
            if (this.page <= 1 && this.currentToken === null) {
                await this.init();
            }
            else {
                this.dataChangedTrigger();
            }
        });
    }
    unsubscribeDataStore() {
        if (this.dataStoreSubscription) {
            this.dataStoreSubscription.unsubscribe();
            this.dataStoreSubscription = null;
        }
    }
    unsubscribe() {
        super.unsubscribe();
        this.unsubscribeDataStore();
    }
}
//# sourceMappingURL=data.query.suject.js.map