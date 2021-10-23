/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
import { BehaviorSubject } from "rxjs";
export class DataGetSuject extends BehaviorSubject {
    constructor(api, id, initialValue) {
        super(initialValue || null);
        this.api = api;
        this.id = id;
        this.isInited = false;
        this.isLoading = false;
        this.dataStoreSubscription = null;
        this.postDataUpdateTrigger = async (update) => update;
        this.postFetchTrigger = () => { };
        this.api.setIdFetcher(async () => this.id);
    }
    setPostFetchTrigger(fn) {
        this.postFetchTrigger = fn;
    }
    setPostDataUpdateTrigger(fn) {
        this.postDataUpdateTrigger = fn;
    }
    async init(id) {
        this.id = id || this.id;
        this.isInited = true;
        await this.clear();
        await this.load();
    }
    async clear() {
        this.next(null);
        this.unsubscribeDataStore();
        this.isLoading = false;
    }
    async load() {
        if (this.isLoading || !this.isInited) {
            return;
        }
        try {
            this.isLoading = true;
            const rawData = await this.fetch();
            const data = this.api.parseItem(rawData);
            this.next(data);
            this.postFetchTrigger();
        }
        finally {
            this.isLoading = false;
        }
    }
    async fetch() {
        if (!this.dataStoreSubscription) {
            await this.subscribeDataStore();
        }
        return this.postDataUpdateTrigger(await this.api.fetch());
    }
    async subscribeDataStore() {
        this.dataStoreSubscription = await this.api.subscribe(async () => {
            await this.init();
        });
    }
    unsubscribeDataStore() {
        this.dataStoreSubscription?.unsubscribe?.();
        this.dataStoreSubscription = null;
    }
    unsubscribe() {
        super.unsubscribe();
        this.unsubscribeDataStore();
    }
}
//# sourceMappingURL=data.get.suject.js.map