/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
import { DataStore, Predicates, } from "@aws-amplify/datastore";
import { DataGetSuject } from "./data.get.suject";
import { DataQuerySuject } from "./data.query.suject";
import { SdkGetApiAdapter, SdkQueryApiAdapter } from "./sdk.api";
export class DataStoreGetApiAdapter extends SdkGetApiAdapter {
    constructor(modelConstructor) {
        super(async (id) => DataStore.query(modelConstructor, id), (id) => DataStore.observe(modelConstructor, id));
    }
}
export class DataStoreQueryApiAdapter extends SdkQueryApiAdapter {
    constructor(modelConstructor) {
        super(async (criteria, options) => DataStore.query(modelConstructor, criteria || Predicates.ALL, { limit: options?.limit, page: options?.page }), (criteria, options) => DataStore.observe(modelConstructor, criteria || undefined));
    }
}
export class DataStoreGetSuject extends DataGetSuject {
    constructor(modelConstructor, id) {
        super(new DataStoreGetApiAdapter(modelConstructor), id);
    }
}
export class DataStoreQuerySuject extends DataQuerySuject {
    constructor(modelConstructor, criteria, initialValue) {
        super(new DataStoreQueryApiAdapter(modelConstructor), criteria, initialValue);
    }
}
//# sourceMappingURL=datastore.api.js.map