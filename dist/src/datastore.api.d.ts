/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
import { PersistentModel, PersistentModelConstructor, ProducerModelPredicate } from "@aws-amplify/datastore";
import { DataGetSuject } from "./data.get.suject";
import { DataQuerySuject } from "./data.query.suject";
import { SdkGetApiAdapter, SdkQueryApiAdapter } from "./sdk.api";
export declare class DataStoreGetApiAdapter<T extends PersistentModel = PersistentModel> extends SdkGetApiAdapter<T, T> {
    constructor(modelConstructor: PersistentModelConstructor<T>);
}
export declare class DataStoreQueryApiAdapter<T extends PersistentModel = PersistentModel> extends SdkQueryApiAdapter<T, ProducerModelPredicate<T>, T[]> {
    constructor(modelConstructor: PersistentModelConstructor<T>);
}
export declare class DataStoreGetSuject<T extends PersistentModel = PersistentModel> extends DataGetSuject<T, T> {
    constructor(modelConstructor: PersistentModelConstructor<T>, id?: string | null);
}
export declare class DataStoreQuerySuject<T extends PersistentModel = PersistentModel> extends DataQuerySuject<T, ProducerModelPredicate<T>, T[]> {
    constructor(modelConstructor: PersistentModelConstructor<T>, criteria?: ProducerModelPredicate<T> | null, initialValue?: T[]);
}
