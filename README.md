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

### Amplify Datastore

#### Get object

``` typescript
import { DataStoreGetSuject } from 'amplify-datastore-rxjs';

// declare suject with model
const MY_MODEL$: DataStoreGetSuject<MY_MODEL> = new DataStoreGetSuject(MY_MODEL);

// initialize with ID when it's known
await MY_MODEL$.init(MY_MODEL_ID);

// subscribe to see the changes (can be called before init - initial value is null)
const subscription = MY_MODEL$.subscribe(async MY_MODEL_INST: MY_MODEL => {
  // logic when initial/new version of the MY_MODEl occured
  if (!!MY_MODEL_INST) { // in case subscribe was before init
    console.info(`got MY_MODEL with id:${MY_MODEL_INST?.id} version:${MY_MODEL_INST?._version}`);
  }
});

// when changes intercepting is not needed anymore
subscription?.unsubscribe();
```

### Custom SDK





## Author
Tomasz Górka <http://tomasz.gorka.org.pl>

## License
&copy; 2021 Tomasz Górka

MIT licensed.

Have fun with using `amplify-datastore-rxjs` ;).
