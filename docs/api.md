## Objects

<dl>
<dt><a href="#webNotification">webNotification</a> : <code>object</code></dt>
<dd><p>A simplified web notification API.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ShowNotificationCallback">ShowNotificationCallback</a> : <code>function</code></dt>
<dd><p>&#39;showNotification&#39; callback.</p>
</dd>
</dl>

<a name="webNotification"></a>

## webNotification : <code>object</code>
A simplified web notification API.

**Kind**: global namespace  
**Author**: Sagie Gur-Ari  

* [webNotification](#webNotification) : <code>object</code>
    * [.allowRequest](#webNotification.allowRequest) : <code>Boolean</code>
    * [.permissionGranted](#webNotification.permissionGranted)
    * [.showNotification([title], [options], [callback])](#webNotification.showNotification)

<a name="webNotification.allowRequest"></a>

### webNotification.allowRequest : <code>Boolean</code>
True to enable automatic requesting of permissions if needed.

**Access**: public  
<a name="webNotification.permissionGranted"></a>

### webNotification.permissionGranted
True if permission is granted, else false.

**Access**: public  
<a name="webNotification.showNotification"></a>

### webNotification.showNotification([title], [options], [callback])
Shows the notification based on the provided input.<br>
The callback invoked will get an error object (in case of an error, null in
case of no errors) and a 'hide' function which can be used to hide the notification.

**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [title] | <code>String</code> |  | The notification title text (defaulted to empty string if null is provided) |
| [options] | <code>Object</code> |  | Holds the notification data (web notification API spec for more info) |
| [options.icon] | <code>String</code> | <code>/favicon.ico</code> | The notification icon (defaults to the website favicon.ico) |
| [options.autoClose] | <code>Number</code> |  | Auto closes the notification after the provided amount of millies (0 or undefined for no auto close) |
| [options.onClick] | <code>function</code> |  | An optional onclick event handler |
| [options.serviceWorkerRegistration] | <code>Object</code> |  | Optional service worker registeration used to show the notification |
| [callback] | [<code>ShowNotificationCallback</code>](#ShowNotificationCallback) |  | Called after the show is handled. |

**Example**  
```js
//show web notification when button is clicked
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

//service worker example
navigator.serviceWorker.register('service-worker.js').then(function(registration) {
    $('.some-button').on('click', function onClick() {
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
<a name="ShowNotificationCallback"></a>

## ShowNotificationCallback : <code>function</code>
'showNotification' callback.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| [error] | <code>error</code> | The error object in case of any error |
| [hide] | <code>function</code> | The hide notification function |

