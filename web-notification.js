/*global module: false, define: false */

/**
 * 'showNotification' callback.
 *
 * @callback ShowNotificationCallback
 * @param {error} [error] - The error object in case of any error
 * @param {function} [hide] - The hide notification function
 */

/**
 * A simplified web notification API.
 *
 * @name webNotification
 * @namespace webNotification
 * @author Sagie Gur-Ari
 */

/**
 * Initializes the web notification API.
 *
 * @function
 * @memberof! webNotification
 * @alias webNotification.initWebNotification
 * @private
 * @param {Object} global - The root context (window/global/...)
 * @param {function} factory - Returns a new instance of the API
 * @returns {Object} New instance of the API
 */
(function initWebNotification(global, factory) {
    'use strict';

    /*istanbul ignore next*/
    var NotificationAPI = global.Notification || window.Notification;

    var webNotification = factory(NotificationAPI);

    /**
     * Initializes the web notification API (only used for testing).
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.initWebNotificationFromContext
     * @private
     * @param {Object} context - The root context (window/global/...)
     * @returns {Object} New instance of the API
     */
    webNotification.initWebNotificationFromContext = function (context) {
        return initWebNotification(context, factory);
    };

    if ((typeof define === 'function') && define.amd) {
        define(function defineLib() {
            return webNotification;
        });
    } else if ((typeof module === 'object') && module.exports) {
        module.exports = webNotification;
    } else {
        global.webNotification = webNotification;
    }

    return webNotification;
}(this, function initWebNotification(NotificationAPI) {
    'use strict';

    var tagCounter = 0;

    var webNotification = {};

    /**
     * The internal Notification library used by this library.
     *
     * @memberof! webNotification
     * @alias webNotification.lib
     * @private
     */
    webNotification.lib = NotificationAPI;

    /**
     * True to enable automatic requesting of permissions if needed.
     *
     * @member {Boolean}
     * @memberof! webNotification
     * @alias webNotification.allowRequest
     * @public
     */
    webNotification.allowRequest = true; //true to enable automatic requesting of permissions if needed

    /*eslint-disable func-name-matching*/
    Object.defineProperty(webNotification, 'permissionGranted', {
        /**
         * Returns the permission granted value.
         *
         * @function
         * @memberof! webNotification
         * @private
         * @returns {Boolean} True if permission is granted, else false
         */
        get: function getPermission() {
            var permission = NotificationAPI.permission;

            /**
             * True if permission is granted, else false.
             *
             * @memberof! webNotification
             * @alias webNotification.permissionGranted
             * @public
             */
            var permissionGranted = false;
            if (permission === 'granted') {
                permissionGranted = true;
            }

            return permissionGranted;
        }
    });
    /*eslint-enable func-name-matching*/

    /**
     * Empty function.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.noop
     * @private
     * @returns {undefined} Undefined
     */
    var noop = function () {
        return undefined;
    };

    /**
     * Checks if web notifications are permitted.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.isEnabled
     * @private
     * @returns {Boolean} True if allowed to show web notifications
     */
    var isEnabled = function () {
        return webNotification.permissionGranted;
    };

    /**
     * Displays the web notification and returning a 'hide' notification function.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.createAndDisplayNotification
     * @private
     * @param {String} title - The notification title text (defaulted to empty string if null is provided)
     * @param {Object} options - Holds the notification data (web notification API spec for more info)
     * @param {String} [options.icon=/favicon.ico] - The notification icon (defaults to the website favicon.ico)
     * @param {Number} [options.autoClose] - Auto closes the notification after the provided amount of millies (0 or undefined for no auto close)
     * @param {function} [options.onClick] - An optional onclick event handler
     * @param {Object} [options.serviceWorkerRegistration] - Optional service worker registeration used to show the notification
     * @param {ShowNotificationCallback} callback - Invoked with either an error or the hide notification function
     */
    var createAndDisplayNotification = function (title, options, callback) {
        var autoClose = 0;
        if (options.autoClose && (typeof options.autoClose === 'number')) {
            autoClose = options.autoClose;
        }

        //defaults the notification icon to the website favicon.ico
        if (!options.icon) {
            options.icon = '/favicon.ico';
        }

        var onNotification = function (notification) {
            //add onclick handler
            if (options.onClick && notification) {
                notification.onclick = options.onClick;
            }

            var hideNotification = function () {
                notification.close();
            };

            if (autoClose) {
                setTimeout(hideNotification, autoClose);
            }

            callback(null, hideNotification);
        };

        var serviceWorkerRegistration = options.serviceWorkerRegistration;
        if (serviceWorkerRegistration) {
            delete options.serviceWorkerRegistration;

            if (!options.tag) {
                tagCounter++;
                options.tag = 'webnotification-' + Date.now() + '-' + tagCounter;
            }
            var tag = options.tag;

            serviceWorkerRegistration.showNotification(title, options).then(function onCreate() {
                serviceWorkerRegistration.getNotifications({
                    tag: tag
                }).then(function notificationsFetched(notifications) {
                    if (notifications && notifications.length) {
                        onNotification(notifications[0]);
                    } else {
                        callback(new Error('Unable to find notification.'));
                    }
                }).catch(callback);
            }).catch(callback);
        } else {
            onNotification(new NotificationAPI(title, options));
        }
    };

    /**
     * Returns an object with the show notification input.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.parseInput
     * @private
     * @param {Array} argumentsArray - An array of all arguments provided to the show notification function
     * @returns {Object} The parsed data
     */
    var parseInput = function (argumentsArray) {
        //callback is always the last argument
        var callback = noop;
        if (argumentsArray.length && (typeof argumentsArray[argumentsArray.length - 1] === 'function')) {
            callback = argumentsArray.pop();
        }

        var title = null;
        var options = null;
        if (argumentsArray.length === 2) {
            title = argumentsArray[0];
            options = argumentsArray[1];
        } else if (argumentsArray.length === 1) {
            var value = argumentsArray.pop();
            if (typeof value === 'string') {
                title = value;
                options = {};
            } else {
                title = '';
                options = value;
            }
        }

        //set defaults
        title = title || '';
        options = options || {};

        return {
            callback: callback,
            title: title,
            options: options
        };
    };

    /**
     * Shows the notification based on the provided input.<br>
     * The callback invoked will get an error object (in case of an error, null in
     * case of no errors) and a 'hide' function which can be used to hide the notification.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.showNotification
     * @public
     * @param {String} [title] - The notification title text (defaulted to empty string if null is provided)
     * @param {Object} [options] - Holds the notification data (web notification API spec for more info)
     * @param {String} [options.icon=/favicon.ico] - The notification icon (defaults to the website favicon.ico)
     * @param {Number} [options.autoClose] - Auto closes the notification after the provided amount of millies (0 or undefined for no auto close)
     * @param {function} [options.onClick] - An optional onclick event handler
     * @param {Object} [options.serviceWorkerRegistration] - Optional service worker registeration used to show the notification
     * @param {ShowNotificationCallback} [callback] - Called after the show is handled.
     * @example
     * ```js
     * //show web notification when button is clicked
     * $('.some-button').on('click', function onClick() {
     *   webNotification.showNotification('Example Notification', {
     *     body: 'Notification Text...',
     *     icon: 'my-icon.ico',
     *     onClick: function onNotificationClicked() {
     *       console.log('Notification clicked.');
     *     },
     *     autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
     *   }, function onShow(error, hide) {
     *     if (error) {
     *       window.alert('Unable to show notification: ' + error.message);
     *     } else {
     *       console.log('Notification Shown.');
     *
     *       setTimeout(function hideNotification() {
     *         console.log('Hiding notification....');
     *         hide(); //manually close the notification (you can skip this if you use the autoClose option)
     *       }, 5000);
     *     }
     *   });
     * });
     *
     * //service worker example
     * navigator.serviceWorker.register('service-worker.js').then(function(registration) {
     *     $('.some-button').on('click', function onClick() {
     *         webNotification.showNotification('Example Notification', {
     *             serviceWorkerRegistration: registration,
     *             body: 'Notification Text...',
     *             icon: 'my-icon.ico',
     *             actions: [
     *                 {
     *                     action: 'Start',
     *                     title: 'Start'
     *                 },
     *                 {
     *                     action: 'Stop',
     *                     title: 'Stop'
     *                 }
     *             ],
     *             autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
     *         }, function onShow(error, hide) {
     *             if (error) {
     *                 window.alert('Unable to show notification: ' + error.message);
     *             } else {
     *                 console.log('Notification Shown.');
     *
     *                 setTimeout(function hideNotification() {
     *                     console.log('Hiding notification....');
     *                     hide(); //manually close the notification (you can skip this if you use the autoClose option)
     *                 }, 5000);
     *             }
     *         });
     *     });
     * });
     * ```
     */
    webNotification.showNotification = function () {
        //convert to array to enable modifications
        var argumentsArray = Array.prototype.slice.call(arguments, 0);

        if ((argumentsArray.length >= 1) && (argumentsArray.length <= 3)) {
            var data = parseInput(argumentsArray);

            //get values
            var callback = data.callback;
            var title = data.title;
            var options = data.options;

            if (isEnabled()) {
                createAndDisplayNotification(title, options, callback);
            } else if (webNotification.allowRequest) {
                NotificationAPI.requestPermission(function onRequestDone() {
                    if (isEnabled()) {
                        createAndDisplayNotification(title, options, callback);
                    } else {
                        callback(new Error('Notifications are not enabled.'), null);
                    }
                });
            } else {
                callback(new Error('Notifications are not enabled.'), null);
            }
        }
    };

    return webNotification;
}));
