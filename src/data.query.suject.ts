/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors. 
 * All rights reserved. MIT license.
 */
import { BehaviorSubject } from "rxjs";
import { AbstractQueryApiAdapter, Item } from "./api.adapter";


export class DataQuerySuject<T extends Item, C = any, D = any> extends BehaviorSubject<T[]> {

    private isFinished: boolean = false;
    private isInited: boolean = false;
    private isLoading: boolean = false;
    private currentToken: string = null;
    private nextToken: string = null;
    private page: number = 0;
    private limit: number = 10;
    private dataStoreSubscription = null;

    private postDataBatchTrigger: (batch: D) => Promise<D> = async batch => batch;
    private postFetchTrigger: () => void = (): void => {};
    private dataChangedTrigger: () => void = (): void => {};


    constructor(
        private api: AbstractQueryApiAdapter<T, D> | null,
        private criteria?: C | null,
        initialValue?: T[]
    ) {
        super(initialValue || []);
        this.api.setCriteriaFetcher(async () => this.criteria);
        this.api.setOptionsFetcher(async () => ({ 
            page: this.page, 
            limit: this.limit, 
            currentToken: this.currentToken,
            nextToken: this.nextToken,
        }));
    }

    public async init(
        criteria?: C | null,
    ): Promise<void> {
        this.criteria = criteria || this.criteria;
        this.isInited = true;
        await this.clear();
        await this.loadNext();
    }

    public setPostFetchTrigger(fn: () => void): void {
        this.postFetchTrigger = fn;
    }

    public setDataChangedTrigger(fn: () => void): void {
        this.dataChangedTrigger = fn;
    }

    public setPostDataBatchTrigger(fn: (batch: D) => Promise<D>): void {
        this.postDataBatchTrigger = fn;
    }

    public async scrollNextEvent(event): Promise<void> {
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

    public trackBy(index: number, item: T): string {
        return `${item.id}#${item?._version}`;
    }

    private async clear(): Promise<void> {
        this.next([]);
        this.unsubscribeDataStore();
        this.page = 0;
        this.nextToken = null;
        this.currentToken = null;
        this.isLoading = false;
        this.isFinished = false;
    }

    private async loadNext(): Promise<void> {
        if (this.isLoading || !this.isInited) { return; }

        try {
            this.isLoading = true;
            const rawData: D = await this.fetch();
            const data: T[] = this.api.parseItems(rawData);
            this.nextToken = this.api.parseNextToken(rawData);
            this.currentToken = this.api.parseCurrentToken(rawData);

            if (this.api.isUsingTokenPagination()) {
                this.page++;
                this.appendItems(data);
                if (!this.nextToken) {
                    this.isFinished = true;
                }
            } else {
                if (data.length > 0) {
                    this.page++;
                    this.appendItems(data);
                } else {
                    this.isFinished = true;
                }
            }

        } finally {
            this.isLoading = false;
        }
    }

    private async fetch(): Promise<D> {
        if (this.page === 0 && this.currentToken === null && this.nextToken === null) {
            await this.subscribeDataStore();
        }
        return this.postDataBatchTrigger(await this.api.fetch());
    }

    private async appendItems(data: T[]): Promise<void> {
        this.next(this.getValue().concat(data));
        this.postFetchTrigger();
    }

    private async subscribeDataStore(): Promise<void> {
        this.dataStoreSubscription = await this.api.subscribe(async (): Promise<void> => {
            if (this.page <= 1 && this.currentToken === null) {
                await this.init();
            } else {
                this.dataChangedTrigger();
            }
        });
    }

    private unsubscribeDataStore(): void {
        if (this.dataStoreSubscription) {
            this.dataStoreSubscription.unsubscribe();
            this.dataStoreSubscription = null;
        }
    }

    public unsubscribe(): void {
        super.unsubscribe();
        this.unsubscribeDataStore();
    }

}
