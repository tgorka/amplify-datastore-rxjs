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
- AWS Configuration already setup in the frontend project:
``` typescript
Amplify.configure(CONFIG);
```

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

## Author
Tomasz Górka <http://tomasz.gorka.org.pl>

## License
&copy; 2021 Tomasz Górka

MIT licensed.

Have fun with using `amplify-datastore-rxjs` ;).
