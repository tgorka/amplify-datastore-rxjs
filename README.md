# amplify-datastore-rxjs

[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT) 

## Table of Contents

* [Description](#description)
* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Author](#author)
* [License](#license)

## Description

Suject helps with loading paginating data from AWS Amplify Datastore and subscribe for the changes with RxJS Observers.
It helps to work with the list with infinitive scroll or trackBy using `id` and `_version` property.
Sujects are having trigger functions that can be used for logging or customizable the process.

## Requirements

- AWS Amplify Datastore Model 

## Installation

```
npm install amplify-datastore-rxjs
```

## Usage

``` typescript
import { DataStoreGetSuject } from 'amplify-datastore-rxjs';

// declare suject with model
const MY_MODEL$: DataStoreGetSuject<MY_MODEL> = new DataStoreGetSuject(MY_MODEL);

// initialize with ID when it's known
await this.MY_MODEL$.init(MY_MODEL_ID);

// subscribe to see the changes (can be called before init - initial value is null)
const subscription = MY_MODEL$.subscribe(async MY_MODEL_INST: MY_MODEL => {
  // logic when initial/new version of the MY_MODEl occured
  if (!!MY_MODEL_INST) { // in case subscribe was before init
    console.info(`got MY_MODEL with id:${MY_MODEL_INST?.id} version:${MY_MODEL_INST?._version}`);
  }
});

// when changes intercepting is not needed anymore
subscription?.unsubscribe(); // not used anymore
```

## Author
Tomasz Górka <http://tomasz.gorka.org.pl>

## License
&copy; 2021 Tomasz Górka

MIT licensed.

Have fun with using `devenv` ;).
