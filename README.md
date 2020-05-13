# simple-web-notification

[![NPM Version](http://img.shields.io/npm/v/simple-web-notification.svg?style=flat)](https://www.npmjs.org/package/simple-web-notification) [![CI](https://github.com/sagiegurari/simple-web-notification/workflows/CI/badge.svg?branch=master)](https://github.com/sagiegurari/simple-web-notification/actions) [![Coverage Status](https://coveralls.io/repos/sagiegurari/simple-web-notification/badge.svg)](https://coveralls.io/r/sagiegurari/simple-web-notification) [![Known Vulnerabilities](https://snyk.io/test/github/sagiegurari/simple-web-notification/badge.svg)](https://snyk.io/test/github/sagiegurari/simple-web-notification) [![Inline docs](http://inch-ci.org/github/sagiegurari/simple-web-notification.svg?branch=master)](http://inch-ci.org/github/sagiegurari/simple-web-notification) [![License](https://img.shields.io/npm/l/simple-web-notification.svg?style=flat)](https://github.com/sagiegurari/simple-web-notification/blob/master/LICENSE)

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
The simple-web-notification is a simplified web notifications API with automatic permissions support.

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
npm install --save simple-web-notification
```

Or if you are using bower, you can install it as follows:

```sh
bower install simple-web-notification --save
```

<a name="limitations"></a>
## Limitations
The web notifications API is not fully supported in all browsers.

Please see [supported browser versions](http://caniuse.com/#feat=notifications) for more information on the official spec support.

## API Documentation
See full docs at: [API Docs](docs/api.md)

## Contributing
See [contributing guide](.github/CONTRIBUTING.md)

<a name="history"></a>
## Release History

| Date        | Version | Description |
| ----------- | ------- | ----------- |
| 2020-05-13  | v2.0.1  | Revert bower.json deletion but not use it in CI build |
| 2020-05-11  | v2.0.0  | Migrate to github actions, upgrade minimal node version and remove bower |
| 2019-02-08  | v1.0.32 | Maintenance |
| 2018-06-25  | v1.0.28 | Expose webNotification.requestPermission #5 |
| 2018-06-14  | v1.0.26 | Better error detection on chrome mobile #4 |
| 2017-08-25  | v1.0.21 | Support service worker web notifications |
| 2017-01-31  | v1.0.3  | Removed polyfill dependency |
| 2017-01-22  | v1.0.0  | Official release |
| 2017-01-22  | v0.0.2  | Initial release |

<a name="license"></a>
## License
Developed by Sagie Gur-Ari and licensed under the Apache 2 open source license.
