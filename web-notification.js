/*global module: false, define: false */

/**
 * 'showNotification' callback.
 *
 * @callback ShowNotificationCallback
 * @param {error} [error] - The error object in case of any error
 * @param {function} [hide] - The hide notification function
 */

/**
 * 'requestPermission' callback.
 *
 * @callback PermissionsRequestCallback
 * @param {Boolean} granted - True if permission is granted, else false
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
    const NotificationAPI = global.Notification || window.Notification;

    const webNotification = factory(NotificationAPI);

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

    let tagCounter = 0;

    const webNotification = {};

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
            const permission = NotificationAPI.permission;

            /**
             * True if permission is granted, else false.
             *
             * @memberof! webNotification
             * @alias webNotification.permissionGranted
             * @public
             */
            let permissionGranted = false;
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
    const noop = function () {
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
    const isEnabled = function () {
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
    const createAndDisplayNotification = function (title, options, callback) {
        let autoClose = 0;
        if (options.autoClose && (typeof options.autoClose === 'number')) {
            autoClose = options.autoClose;
        }

        //defaults the notification icon to the website favicon.ico
        if (!options.icon) {
            options.icon = '/favicon.ico';
        }

        const onNotification = function (notification) {
            //add onclick handler
            if (options.onClick && notification) {
                notification.onclick = options.onClick;
            }

            const hideNotification = function () {
                notification.close();
            };

            if (autoClose) {
                setTimeout(hideNotification, autoClose);
            }

            callback(null, hideNotification);
        };

        const serviceWorkerRegistration = options.serviceWorkerRegistration;
        if (serviceWorkerRegistration) {
            delete options.serviceWorkerRegistration;

            if (!options.tag) {
                tagCounter++;
                options.tag = 'webnotification-' + Date.now() + '-' + tagCounter;
            }
            const tag = options.tag;

            serviceWorkerRegistration.showNotification(title, options).then(function onCreate() {
                serviceWorkerRegistration.getNotifications({
                    tag
                }).then(function notificationsFetched(notifications) {
                    if (notifications && notifications.length) {
                        onNotification(notifications[0]);
                    } else {
                        callback(new Error('Unable to find notification.'));
                    }
                }).catch(callback);
            }).catch(callback);
        } else {
            let instance;
            try {
                instance = new NotificationAPI(title, options);
            } catch (error) {
                callback(error);
            }

            //in case of no errors
            if (instance) {
                onNotification(instance);
            }
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
    const parseInput = function (argumentsArray) {
        //callback is always the last argument
        let callback = noop;
        if (argumentsArray.length && (typeof argumentsArray[argumentsArray.length - 1] === 'function')) {
            callback = argumentsArray.pop();
        }

        let title = null;
        let options = null;
        if (argumentsArray.length === 2) {
            title = argumentsArray[0];
            options = argumentsArray[1];
        } else if (argumentsArray.length === 1) {
            const value = argumentsArray.pop();
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
            callback,
            title,
            options
        };
    };

    /**
     * Triggers the request permissions dialog in case permissions were not already granted.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.requestPermission
     * @public
     * @param {PermissionsRequestCallback} callback - Called with the permissions result (true enabled, false disabled)
     * @example
     * ```js
     * //manually ask for notification permissions (invoked automatically if needed and allowRequest=true)
     * webNotification.requestPermission(function onRequest(granted) {
     *  if (granted) {
     *      console.log('Permission Granted.');
     *  } else {
     *      console.log('Permission Not Granted.');
     *  }
     * });
     * ```
     */
    webNotification.requestPermission = function (callback) {
        if (callback && typeof callback === 'function') {
            if (isEnabled()) {
                callback(true);
            } else {
                NotificationAPI.requestPermission(function onRequestDone() {
                    callback(isEnabled());
                });
            }
        }
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
     * document.querySelector('.some-button').addEventListener('click', function onClick() {
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
     *     document.querySelector('.some-button').addEventListener('click', function onClick() {
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
        const argumentsArray = Array.prototype.slice.call(arguments, 0);

        if ((argumentsArray.length >= 1) && (argumentsArray.length <= 3)) {
            const data = parseInput(argumentsArray);

            //get values
            const callback = data.callback;
            const title = data.title;
            const options = data.options;

            webNotification.requestPermission(function onRequestDone(granted) {
                if (granted) {
                    createAndDisplayNotification(title, options, callback);
                } else {
                    callback(new Error('Notifications are not enabled.'), null);
                }
            });
        }
    };

    return webNotification;
}));
