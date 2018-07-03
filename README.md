# generator-jhipster-social-login-api
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, Adds social login api calls to work with native Android and iOS apps

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

This module adds the needed extra code to be able to use the Social Login functionality from the [android-jhi](https://github.com/greengrowapps/generator-android-jhi) generator. 

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

# Installation

## With Yarn

To install this module:

```bash
yarn global add generator-jhipster-social-login-api
```

To update this module:

```bash
yarn global upgrade generator-jhipster-social-login-api
```

## With NPM

To install this module:

```bash
npm install -g generator-jhipster-social-login-api
```

To update this module:

```bash
npm update -g generator-jhipster-social-login-api
```

# Usage

Inside your jhipster project folder run

```bash
yo jhipster-social-login-api
```

Then create your [Google](https://console.developers.google.com/) and/or [Facebook](https://developers.facebook.com/) credentials

For Google you will need three. Web, Android and iOS

Choose the Web credential and download de json file. Replace the "googlecredentials.json" inside the resources folder.

Follow the instructions on [android-jhi](https://github.com/greengrowapps/generator-android-jhi) to configure the app

# License

Apache-2.0 © [Green Grow Apps](https://greengrowapps.com)


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-social-login-api.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-social-login-api
[travis-image]: https://travis-ci.org/greengrowapps/generator-jhipster-social-login-api.svg?branch=master
[travis-url]: https://travis-ci.org/greengrowapps/generator-jhipster-social-login-api
[daviddm-image]: https://david-dm.org/greengrowapps/generator-jhipster-social-login-api.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/greengrowapps/generator-jhipster-social-login-api
