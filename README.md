# simple-web-notification

[![Bower Version](https://img.shields.io/bower/v/simple-web-notification.svg?style=flat)](https://github.com/sagiegurari/simple-web-notification/releases) [![NPM Version](http://img.shields.io/npm/v/simple-web-notification.svg?style=flat)](https://www.npmjs.org/package/simple-web-notification) [![Build Status](https://travis-ci.org/sagiegurari/simple-web-notification.svg)](http://travis-ci.org/sagiegurari/simple-web-notification) [![Coverage Status](https://coveralls.io/repos/sagiegurari/simple-web-notification/badge.svg)](https://coveralls.io/r/sagiegurari/simple-web-notification) [![bitHound Code](https://www.bithound.io/github/sagiegurari/simple-web-notification/badges/code.svg)](https://www.bithound.io/github/sagiegurari/simple-web-notification) [![Inline docs](http://inch-ci.org/github/sagiegurari/simple-web-notification.svg?branch=master)](http://inch-ci.org/github/sagiegurari/simple-web-notification)<br>
[![License](https://img.shields.io/bower/l/simple-web-notification.svg)](https://github.com/sagiegurari/simple-web-notification/blob/master/LICENSE) [![Retire Status](http://retire.insecurity.today/api/image?uri=https://raw.githubusercontent.com/sagiegurari/simple-web-notification/master/bower.json)](http://retire.insecurity.today/api/image?uri=https://raw.githubusercontent.com/sagiegurari/simple-web-notification/master/bower.json)

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
bower install simple-web-notification --save
```

Or if you are using NPM to download client libraries, you can install it as follows:

```sh
npm install --save simple-web-notification
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
| 2017-03-09  | v1.0.8  | Maintenance |
| 2017-01-31  | v1.0.3  | Removed polyfill dependency |
| 2017-01-22  | v1.0.2  | Maintenance |
| 2017-01-22  | v1.0.0  | Official release |
| 2017-01-22  | v0.0.2  | Initial release |

<a name="license"></a>
## License
Developed by Sagie Gur-Ari and licensed under the Apache 2 open source license.
