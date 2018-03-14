# node-car-api (work in progress)

> Unofficial caradisiac.com api wrapper

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Introduction](#introduction)
- [Objective - Workshop in 1 sentence](#objective---workshop-in-1-sentence)
- [How to do that?](#how-to-do-that)
  - [Stack](#stack)
- [Just tell me what to do](#just-tell-me-what-to-do)
- [Examples of steps to do](#examples-of-steps-to-do)
  - [Populate](#populate)
  - [List of suv](#list-of-suv)
- [MVP](#mvp)
  - [Client-side (bonus)](#client-side-bonus)
- [Don't forget](#dont-forget)
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
