# node-car-api (work in progress)

> Unofficial caradisiac.com api wrapper

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Api](#api)
  - [getBrands(configuration)](#getbrandsconfiguration)
    - [configuration](#configuration)
      - [headers](#headers)
      - [proxy](#proxy)
  - [getModels(brand, configuration)](#getmodelsbrand-configuration)
    - [brand](#brand)
      - [name](#name)
      - [url](#url)
    - [configuration](#configuration-1)
      - [headers](#headers-1)
      - [proxy](#proxy-1)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

Get all technical records related to car specification from [caradisiac.com](http://www.caradisiac.com/fiches-techniques).

## Installation

```sh
npm install git@github.com:92bondstreet/node-car-api.git
```

## Usage

```js
const {getBrands} = require('node-car-api');

const brands = await getBrands();

console.log(brands);
```

```js
const {getModels} = require('node-car-api');

const brand = {
  'name': 'peugeot'
  'url': 'http://www.caradisiac.com/auto--peugeot/'
}
const models = await getModels(brand);

console.log(models);
```

## Api

### getBrands(configuration)

Return array of brands

#### configuration

Type: Object

##### headers
Type: Object
Default: {}

##### proxy
Type: String
Default: null

### getModels(brand, configuration)

Return array of models for the given brand

#### brand

Type: Object

##### name
Type: String
Default: {}

##### url
Type: String
Default: ''


#### configuration

Type: Object

##### headers
Type: Object
Default: {}

##### proxy
Type: String
Default: null


## Licence

[Uncopyrighted](http://zenhabits.net/uncopyright/)
