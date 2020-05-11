/*global console: false */

document.addEventListener('DOMContentLoaded', function onLoad() {
    let serviceWorkerRegistration;

    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('service-worker.js').then(function (registration) {
            serviceWorkerRegistration = registration;
        });
    }

    const titleElement = document.getElementById('title');
    const messageElement = document.getElementById('message');
    const buttonElement = document.querySelector('.btn');

    titleElement.value = 'Example Notification';
    messageElement.value = 'This is some notification text.';

    buttonElement.addEventListener('click', function onClick() {
        webNotification.showNotification(titleElement.value, {
            serviceWorkerRegistration: serviceWorkerRegistration,
            body: messageElement.value,
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
});
