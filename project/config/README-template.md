# {"gitdown": "gitinfo", "name": "name"}

[![NPM Version](http://img.shields.io/npm/v/{"gitdown": "gitinfo", "name": "name"}.svg?style=flat)](https://www.npmjs.org/package/{"gitdown": "gitinfo", "name": "name"}) [![CI](https://github.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/workflows/CI/badge.svg?branch=master)](https://github.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/actions) [![Coverage Status](https://coveralls.io/repos/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/badge.svg)](https://coveralls.io/r/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![Known Vulnerabilities](https://snyk.io/test/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/badge.svg)](https://snyk.io/test/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![Inline docs](http://inch-ci.org/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}.svg?branch=master)](http://inch-ci.org/github/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}) [![License](https://img.shields.io/npm/l/{"gitdown": "gitinfo", "name": "name"}.svg?style=flat)](https://github.com/{"gitdown": "gitinfo", "name": "username"}/{"gitdown": "gitinfo", "name": "name"}/blob/master/LICENSE)

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
document.querySelector('.some-button').addEventListener('click', function onClick() {
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

In case you wish to use service worker web notifications, you must provide the serviceWorkerRegistration in the options as follows:

```js
navigator.serviceWorker.register('service-worker.js').then(function(registration) {
    document.querySelector('.some-button').addEventListener('click', function onClick() {
        webNotification.showNotification('Example Notification', {
            serviceWorkerRegistration: registration,
            body: 'Notification Text...',
            icon: 'my-icon.ico',
            actions: [
                {
                    action: 'Start',
                    title: 'Start'
                },
                {
                    action: 'Stop',
                    title: 'Stop'
                }
            ],
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
});
```

In case you wish to invoke the permissions API manually you can use the webNotification.requestPermission function.<br>
This function triggers the request permissions dialog in case permissions were not already granted.

```js
//manually ask for notification permissions (invoked automatically if needed and allowRequest=true)
webNotification.requestPermission(function onRequest(granted) {
    if (granted) {
        console.log('Permission Granted.');
    } else {
        console.log('Permission Not Granted.');
    }
});
```

When using an AMD loader (such as RequireJS) or CommonJS type loader, the webNotification object is not automatically defined on the window scope.

<a name="installation"></a>
## Installation
Run npm install in your project as follows:

```sh
npm install --save {"gitdown": "gitinfo", "name": "name"}
```

Or if you are using bower, you can install it as follows:

```sh
bower install {"gitdown": "gitinfo", "name": "name"} --save
```

<a name="limitations"></a>
## Limitations
The web notifications API is not fully supported in all browsers.

Please see [supported browser versions](http://caniuse.com/#feat=notifications) for more information on the official spec support.

{"gitdown": "include", "file": "./README-footer-template.md"}
