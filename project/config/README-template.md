# {"gitdown": "gitinfo", "name": "name"}

[![Bower Version](https://img.shields.io/bower/v/{"gitdown": "gitinfo", "name": "name"}.svg?style=flat)](https://github.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/releases) [![NPM Version](http://img.shields.io/npm/v/{"gitdown": "gitinfo", "name": "name"}.svg?style=flat)](https://www.npmjs.org/package/{"gitdown": "gitinfo", "name": "name"}) [![Build Status](https://travis-ci.org/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}.svg)](http://travis-ci.org/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![Coverage Status](https://coveralls.io/repos/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/badge.svg)](https://coveralls.io/r/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![bitHound Code](https://www.bithound.io/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/badges/code.svg)](https://www.bithound.io/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![Inline docs](http://inch-ci.org/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}.svg?branch=master)](http://inch-ci.org/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"})<br>
[![License](https://img.shields.io/bower/l/{"gitdown": "gitinfo", "name": "name"}.svg)](https://github.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/blob/master/LICENSE) [![Retire Status](http://retire.insecurity.today/api/image?uri=https://raw.githubusercontent.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/master/bower.json)](http://retire.insecurity.today/api/image?uri=https://raw.githubusercontent.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/master/bower.json)

> Web Notifications made easy

* [Overview](#overview)
* [Demo](https://sagiegurari.github.io/simple-web-notification/)
* [Usage](#usage)
* [Installation](#installation)
* [Limitations](#limitations)
* [API Documentation](docs/api.md)
* [Contributing](.github/CONTRIBUTING.md)
* [Release History](#history)
* [License](#license)

<a name="overview"></a>
## Overview
The {"gitdown": "gitinfo", "name": "name"} is a simplified web notifications API with automatic permissions support.

This library requires no external dependencies, however the browser must support the Notification API or have a polyfill available.

See [W3 Specification](https://dvcs.w3.org/hg/notifications/raw-file/tip/Overview.html) for more information.

## Demo
[Live Demo](https://sagiegurari.github.io/simple-web-notification/)

<a name="usage"></a>
## Usage
In order to use the simplified web notification API you first must add the relevant dependencies:

```html
<script type="text/javascript" src="web-notification.js"></script>
```

Now you can use the API anywhere in your application, for example:

```js
$('.some-button').on('click', function onClick() {
    webNotification.showNotification('Example Notification', {
        body: 'Notification Text...',
        icon: 'my-icon.ico',
        onClick: function onNotificationClicked() {
            console.log('Notification clicked.');
        },
        autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
    }, function onShow(error, hide) {
        if (error) {
            window.alert('Unable to show notification: ' + error.message);
        } else {
            console.log('Notification Shown.');

            setTimeout(function hideNotification() {
                console.log('Hiding notification....');
                hide(); //manually close the notification (you can skip this if you use the autoClose option)
            }, 5000);
        }
    });
});
```

When using an AMD loader (such as RequireJS) or CommonJS type loader, the webNotification object is not automatically defined on the window scope.

<a name="installation"></a>
## Installation
Run bower install in your project as follows:

```sh
bower install {"gitdown": "gitinfo", "name": "name"} --save
```

Or if you are using NPM to download client libraries, you can install it as follows:

```sh
npm install --save {"gitdown": "gitinfo", "name": "name"}
```

<a name="limitations"></a>
## Limitations
The web notifications API is not fully supported in all browsers.

Please see [supported browser versions](http://caniuse.com/#feat=notifications) for more information on the official spec support.

{"gitdown": "include", "file": "./README-footer-template.md"}
