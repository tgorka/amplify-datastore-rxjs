/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors. 
 * All rights reserved. MIT license.
 */
import { BehaviorSubject } from "rxjs";
import { AbstractGetApiAdapter } from "./api.adapter";


export class DataGetSuject<T, D = T> extends BehaviorSubject<T> {

    private isInited: boolean = false;
    private isLoading: boolean = false;
    private dataStoreSubscription = null;

    private postDataUpdateTrigger: (update: D) => Promise<D> = async update => update;
    private postFetchTrigger: () => void = (): void => {};

    constructor(
        private api: AbstractGetApiAdapter<T, D> | null,
        private id?: string | null,
        initialValue?: T
    ) {
        super(initialValue || null);
        this.api.setIdFetcher(async () => this.id);
    }

    public setPostFetchTrigger(fn: () => void): void {
        this.postFetchTrigger = fn;
    }

    public setPostDataUpdateTrigger(fn: (update: D) => Promise<D>): void {
        this.postDataUpdateTrigger = fn;
    }

    public async init(
        id?: string | null,
    ): Promise<void> {
        this.id = id || this.id;
        this.isInited = true;
        await this.clear();
        await this.load();
    }

    private async clear(): Promise<void> {
        this.next(null);
        this.unsubscribeDataStore();
        this.isLoading = false;
    }

    private async load(): Promise<void> {
        if (this.isLoading || !this.isInited) { return; }

        try {
            this.isLoading = true;
            const rawData: D = await this.fetch();
            const data: T = this.api.parseItem(rawData);
            this.next(data);
            this.postFetchTrigger();
        } finally {
            this.isLoading = false;
        }
    }

    private async fetch(): Promise<D> {
        if (!this.dataStoreSubscription) {
            await this.subscribeDataStore();
        }
        return this.postDataUpdateTrigger(await this.api.fetch());
    }

    private async subscribeDataStore(): Promise<void> {
        this.dataStoreSubscription = await this.api.subscribe(async (): Promise<void> => {
            await this.init();
        });
    }

    private unsubscribeDataStore(): void {
        this.dataStoreSubscription?.unsubscribe?.();
        this.dataStoreSubscription = null;
    }

    public unsubscribe(): void {
        super.unsubscribe();
        this.unsubscribeDataStore();
    }
}
