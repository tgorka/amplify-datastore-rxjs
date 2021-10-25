# amplify-datastore-rxjs

[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT) 
[![PUBLISHING](https://github.com/tgorka/amplify-datastore-rxjs/actions/workflows/main.yml/badge.svg)](https://github.com/tgorka/amplify-datastore-rxjs/actions/workflows/main.yml) 
[![NPM version](https://img.shields.io/npm/v/amplify-datastore-rxjs.svg?style=flat)](https://npmjs.org/package/amplify-datastore-rxjs)

RxJs Subjects to work with AWS Amplify and Amplify Datastore.

## Table of Contents

* [Description](#description)
* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Examples](#examples)
* [Author](#author)
* [License](#license)

## Description

- RxJS Suject helps with loading paginating data 
- Subscribing to data change and re-fetching subsciption event
- AWS Amplify Datastore adapter for fetching and subscription
- SDK custom adapter for subscription and re-retching (wotks with amplify generated graphql API)
- Contains helper to work with the list with infinitive scroll using Ionic 
- Contains helper with trackBy using `id` and `_version` property for angular lists
- Sujects are having trigger functions that can be used for logging or customizable the process.

## Requirements

In order to use amplify datastore:
- Amplify datastore Model configured on server site
- AWS/Amplify Configuration already setup in the frontend project:
``` typescript
Amplify.configure(CONFIG);
```

## Installation

```
npm install amplify-datastore-rxjs
```

## Usage

Library is simplified fetching and subscription enclosing it in the RxJS BehaviorSubject. 
- There are 2 classes for the BehaviorSubject:
  - ```DataGetSuject``` for the single data record fetched by id
  - ```DataQuerySuject``` for the list of the data records fetched by the criteria using batches
- There is default object (```null``` or ```[]```) serve before the first time data is fetched from the source.
- After calling ```init``` the data is fetched and subscription to the data changes is setup.
- After subscription notify for the changes the data is re-fetch from the source and the RxJS pipe is pushed with the next data.
- Adapter in the constructor for customizing data source get/query/subscribe/parse operation.
- There are adapters and classes with encapsulating this adapters for **Amplify datasource** and **Custom SDK** source (that could be used for custom graphQL, REST, RPC, SOAP, SDK/lib ...).
  - ```DataStoreGetApiAdapter```, ```DataStoreQueryApiAdapter``` adapters for **Amplify datasource**.
  - ```DataStoreGetSuject```, ```DataStoreQuerySuject``` BehaviorSujects for **Amplify datasource** (with wrapped adapters).
  - ```SdkGetApiAdapter```, ```SdkQueryApiAdapter``` adapters for ***Custom SDK***.
  - ```SdkGetSuject```, ```SdkQuerySuject``` BehaviorSujects for **Custom SDK** (with wrapped adapters).
  - ```GetApiAdapter```, ```QueryApiAdapter``` interfaces for the adapters.
  - ```AbstractGetApiAdapter```, ```AbstractQueryApiAdapter``` partly pre-implemented classes for building custom adapters.
- There are helpfull methods in ```DataQuerySuject```.
  - ```scrollNextEvent``` can be used for ifinitive scroll (with **ion-scroll** from **Ionic**) of by throwing an event for fetching next batch of the data.
  - ```trackBy``` can be used to speedup display large set of data records in **Angular** using conbination of ```id``` and ```_version``` (if exists) data properties.
- There are trigger functions that can be setup to infiltrate data flow (for logs, data manipulation in the process, event interceptions, ...).
  - ```postDataUpdateTrigger```, ```postDataBatchTrigger``` infiltrating raw data in the process fetched from the source. Can be used for logs or modification of the data from the source that is too specific for having/modifing custom adapter for the data souce.
  - ```postFetchTrigger``` trigger after new data has been set into the RxJS pipe. Can be used for custom view refresh triggered if not detected autmaticly.
  - ```dataChangedTrigger``` only on ```DataQuerySuject``` triger after subscription to the data has been triggered but more than first batch of data has been feteched already. The data is **NOT** automaticly refreshed. It can be used to showing to the used that viewing data set has been mutated and can be refreshed manually (using ```init``` method). If only one batch of data has been fetched the data is automaticly refreshed and ```postFetchTrigger``` can be used for infitrating instead.

## Examples 

### Requirements

Amplify datastore Test model taken as an example for datastore and api angular service generated from the model used for Custom SDK usage.
The Test ```schema.graphql``` for the amplify example:

```graphql
type Test @model {
  id: ID!
  text: String
}
```

### Amplify Datastore

#### DataStoreGetSuject

##### declaration

``` typescript
import { Test } from 'src/models'; // Model generated from **amplify codegen**
import { DataGetSuject, DataStoreGetSuject } from 'amplify-datastore-rxjs';

// declare suject with model
// amplify datastore model is used to determinate how to fetch/subscribe data from the source
const test$: DataGetSuject<Test> = new DataStoreGetSuject(Test); 
// if the id of the data is known already the initialization can be done by: 
// new DataStoreGetSuject(Test, 'TEST_RECORD_ID')
// if the value before fetching (or befor initialization) should be different than null it can be placed as third parameter in the constructor:
// new DataStoreGetSuject(Test, 'TEST_RECORD_ID', initialTestObj) or new DataStoreGetSuject(Test, null, initialTestObj)
``` 

##### initialion (if not done during declation)

Can be placed when id of the data record is known or has been changed

``` typescript
await test$.init('TEST_RECORD_ID');
``` 

##### subscription (independend from initialization)

``` typescript
// subscribe to see the changes (can be called before init - initial value is null)
const subscription = test$.subscribe(async test: Test => {
  // logic when initial/new version of the Test occured
  if (!!test) { // in case subscribe was before init
    console.info(`got test with id:${test?.id} version:${test?._version}`);
  }
});
``` 
##### unsubscription (onDestroy)

``` typescript
// when changes intercepting is not needed anymore
subscription?.unsubscribe();
```

##### Angular test.component.ts example

taken id from query parameters

``` typescript
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataStoreGetSuject, DataGetSuject } from 'amplify-datastore-rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit, OnDestroy {
  
  testID$: Observable<string> = this.route.queryParamMap.pipe(map(paramMap => paramMap.get('test')));
  testIDSubscription: any = null;
  test$: DataQuerySuject<Test> = new DataStoreQuerySuject(Test);

  constructor(
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
  ) {
    this.test$.setPostFetchTrigger(() => {
      this.ref.detectChanges();
      this.logger.info(`loaded test`);
    });
    this.test$.setPostDataUpdateTrigger(async (test: Test): Promise<Test> => {
        this.logger.info(`fetched test with id:${test.id}|_version:${test._version}`);
        return test;
    });
  }

  async ngOnInit() {
    this.testIDSubscription?.unsubscribe();
    this.testIDSubscription = this.testID$.subscribe(async testID => {
      if (!!testID) {
        await this.test$.init(testID);
      } else {
        this.logger.warn(`there is no test in the parameters: ${testID}`);
      }
    });
  }

  ngOnDestroy(): void {
    this.testIDSubscription?.unsubscribe();
  }
}
```



### Custom SDK





## Author
Tomasz Górka <http://tomasz.gorka.org.pl>

## License
&copy; 2021 Tomasz Górka

MIT licensed.

Have fun with using `amplify-datastore-rxjs` ;).
