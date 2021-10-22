/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors. 
 * All rights reserved. MIT license.
 */
import { 
    DataStore,
    PersistentModel, 
    PersistentModelConstructor,
    Predicates,
    ProducerModelPredicate, 
} from "@aws-amplify/datastore";
import { Subscriber } from "./api.adapter";
import { DataGetSuject } from "./data.get.suject";
import { DataQuerySuject } from "./data.query.suject";
import { SdkGetApiAdapter, SdkQueryApiAdapter } from "./sdk.api";


export class DataStoreGetApiAdapter<T extends PersistentModel = PersistentModel> extends SdkGetApiAdapter<T, T> {
    constructor(
        modelConstructor: PersistentModelConstructor<T>
    ) {
        super(
            async (id: string): Promise<T> => DataStore.query(modelConstructor, id),
            (id: string): Subscriber => DataStore.observe(modelConstructor, id),
        );
    }
}

export class DataStoreQueryApiAdapter<T extends PersistentModel = PersistentModel> extends SdkQueryApiAdapter<T, ProducerModelPredicate<T>, T[]> {
    constructor(
        modelConstructor: PersistentModelConstructor<T>
    ) {
        super(
            async (criteria: ProducerModelPredicate<T>, options: any): Promise<T[]> => 
                DataStore.query(modelConstructor, criteria || Predicates.ALL, 
                { limit: options?.limit, page: options?.page }),
            (criteria: ProducerModelPredicate<T>, options: any): Subscriber => 
                DataStore.observe(modelConstructor, criteria || undefined),
        );
    }
}

export class DataStoreGetSuject<T extends PersistentModel = PersistentModel> extends DataGetSuject<T, T> {
    constructor(
        modelConstructor: PersistentModelConstructor<T>,
        id?: string | null
    ) {
        super(new DataStoreGetApiAdapter<T>(modelConstructor), id);
    }
}

export class DataStoreQuerySuject<T extends PersistentModel = PersistentModel> extends DataQuerySuject<T, ProducerModelPredicate<T>, T[]> {
    constructor(
        modelConstructor: PersistentModelConstructor<T>,
        criteria?: ProducerModelPredicate<T> | null,
        initialValue?: T[]
    ) {
        super(new DataStoreQueryApiAdapter<T>(modelConstructor), criteria, initialValue);
    }
}
