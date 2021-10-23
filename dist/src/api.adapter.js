/**
 * amplify-datastore-rxjs
 * Copyright 2021 the amplify-datastore-rxjs authors.
 * All rights reserved. MIT license.
 */
export class AbstractGetApiAdapter {
    constructor() {
        this.idFetcher = () => { throw new Error("Call setIdFetcher() before usage."); };
    }
    setIdFetcher(idFetcher) {
        this.idFetcher = idFetcher;
    }
    async id() {
        return this.idFetcher();
    }
}
export class AbstractQueryApiAdapter {
    constructor() {
        this.criteriaFetcher = () => { throw new Error("Call setCriteriaFetcher() before usage."); };
        this.optionsFetcher = () => { throw new Error("Call setOptionsFetcher() before usage."); };
    }
    setCriteriaFetcher(criteriaFetcher) {
        this.criteriaFetcher = criteriaFetcher;
    }
    setOptionsFetcher(optionsFetcher) {
        this.optionsFetcher = optionsFetcher;
    }
    criteria() {
        return this.criteriaFetcher();
    }
    options() {
        return this.optionsFetcher();
    }
}
//# sourceMappingURL=api.adapter.js.map