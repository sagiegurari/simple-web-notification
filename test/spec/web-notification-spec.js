/*global describe: false, assert: false, it: false, beforeEach: false */

describe('simple-web-notification', function () {
    'use strict';

    var emptyValuesValidation = function (title, options) {
        assert.equal(title, '');
        assert.deepEqual(options, {
            icon: '/favicon.ico'
        });
    };
    var validShowValidation = function (error, hide, done) {
        assert.isNull(error);
        assert.isFunction(hide);

        hide();

        if (done) {
            done();
        }
    };
    var errorValidation = function (error, hide, done) {
        assert.isDefined(error);
        assert.isNull(hide);
        done();
    };

    beforeEach(function () {
        window.webNotification.allowRequest = true;
    });

    it('init test', function () {
        assert.isObject(window.webNotification);
        assert.isTrue(window.Notification.MOCK_NOTIFY);
        assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
    });

    describe('showNotification tests', function () {
        describe('showNotification allowed tests', function () {
            it('showNotification all info test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.deepEqual(options, {
                        body: 'Notification Text...',
                        icon: 'my-icon.ico'
                    });
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: 'my-icon.ico'
                }, function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('showNotification with auto close test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.deepEqual(options, {
                        body: 'Notification Text...',
                        icon: 'my-icon.ico',
                        autoClose: 600
                    });
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: 'my-icon.ico',
                    autoClose: 600
                }, function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('showNotification no params test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(emptyValuesValidation);

                window.webNotification.showNotification(function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('showNotification no input test', function () {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(emptyValuesValidation);

                window.webNotification.showNotification();
            });

            it('showNotification too many args test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(emptyValuesValidation);

                window.webNotification.showNotification(1, 2, 3, 4, function () {
                    assert.fail();
                });

                setTimeout(function () {
                    done();
                }, 50);
            });

            it('showNotification null info test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(emptyValuesValidation);

                window.webNotification.showNotification(null, null, function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('showNotification no callback test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.deepEqual(options, {
                        body: 'Notification Text...',
                        icon: 'my-icon.ico'
                    });
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: 'my-icon.ico'
                });

                setTimeout(done, 50);
            });

            it('showNotification no title test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, '');
                    assert.deepEqual(options, {
                        body: 'no title',
                        icon: '/favicon.ico'
                    });
                });

                window.webNotification.showNotification({
                    body: 'no title'
                }, function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('showNotification with no icon test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.deepEqual(options, {
                        body: 'Notification Text...',
                        icon: '/favicon.ico'
                    });
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...'
                }, function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('showNotification no options test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'no options');
                    assert.deepEqual(options, {
                        icon: '/favicon.ico'
                    });
                });

                window.webNotification.showNotification('no options', function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('showNotification first time permissions test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setNotAllowed(function (title, options) {
                    assert.equal(title, 'first time');
                    assert.deepEqual(options, {
                        icon: '/favicon.ico'
                    });
                });

                window.Notification.onceRequestPermission(function () {
                    window.Notification.setAllowed(function (title, options) {
                        assert.equal(title, 'first time');
                        assert.deepEqual(options, {
                            icon: '/favicon.ico'
                        });
                    });
                });

                window.webNotification.showNotification('first time', {}, function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('showNotification with onClick', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.isFunction(options.onClick);
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: 'my-icon.ico',
                    onClick: function () {
                        done();
                    }
                }, function onShow(error, hide) {
                    validShowValidation(error, hide);
                });
            });
        });

        describe('showNotification not allowed tests', function () {
            it('showNotification not allowed test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setNotAllowed();

                window.webNotification.showNotification('not allowed', {}, function onShow(error, hide) {
                    errorValidation(error, hide, done);
                });
            });

            it('showNotification not allowed and not allowed to ask permissions test', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setNotAllowed();
                window.webNotification.allowRequest = false;

                window.webNotification.showNotification('no allowRequest', {}, function onShow(error, hide) {
                    errorValidation(error, hide, done);
                });
            });
        });
    });
});
