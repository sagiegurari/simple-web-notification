/*global console: false */

$(function onLoad() {
    var $title = $('#title');
    var $message = $('#message');
    var $button = $('.btn');

    $title.val('Example Notification');
    $message.val('This is some notification text.');

    $button.on('click', function onClick() {
        webNotification.showNotification($title.val(), {
            body: $message.val(),
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
