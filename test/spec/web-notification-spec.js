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

    describe('showNotification tests', function () {
        it('window', function () {
            assert.isObject(window.webNotification);
            assert.isFunction(window.webNotification.initWebNotificationFromContext);
            assert.isFunction(window.webNotification.showNotification);
            assert.isTrue(window.Notification.MOCK_NOTIFY);
            assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
        });

        it('global', function () {
            var global = {
                Notification: window.Notification
            };

            window.webNotification.initWebNotificationFromContext(global);

            assert.isObject(global.webNotification);
            assert.isFunction(global.webNotification.showNotification);
        });

        it('define', function () {
            var global = {
                Notification: window.Notification
            };

            window.define = function (factory) {
                var webNotification = factory();

                assert.isObject(webNotification);
                assert.isFunction(webNotification.showNotification);

                delete window.define;
            };
            window.define.amd = true;

            window.webNotification.initWebNotificationFromContext(global);
        });

        it('module', function () {
            var global = {
                Notification: window.Notification
            };

            window.module = {
                exports: {}
            };

            window.webNotification.initWebNotificationFromContext(global);

            assert.isFunction(window.module.exports.showNotification);

            delete window.module;
        });
    });

    describe('requestPermission', function () {
        it('no callback', function () {
            assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
            window.Notification.errorOnPermission = true;

            window.webNotification.requestPermission();

            window.Notification.errorOnPermission = false;
        });

        it('callback not a function', function () {
            assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
            window.Notification.errorOnPermission = true;

            window.webNotification.requestPermission(true);

            window.Notification.errorOnPermission = false;
        });

        it('allowed', function (done) {
            assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
            window.Notification.setAllowed();

            window.webNotification.requestPermission(function (granted) {
                assert.isTrue(granted);
                done();
            });
        });

        it('not allowed', function (done) {
            assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
            window.Notification.setNotAllowed();

            window.webNotification.requestPermission(function (granted) {
                assert.isFalse(granted);
                done();
            });
        });

        it('error', function (done) {
            assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
            window.Notification.errorOnPermission = true;

            window.webNotification.requestPermission(function (granted) {
                assert.isFalse(granted);
                done();
            });

            window.Notification.errorOnPermission = false;
        });
    });

    describe('showNotification', function () {
        describe('allowed', function () {
            it('all info', function (done) {
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

            it('auto close', function (done) {
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

            it('no params', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(emptyValuesValidation);

                window.webNotification.showNotification(function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('no input', function () {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(emptyValuesValidation);

                window.webNotification.showNotification();
            });

            it('too many args', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(emptyValuesValidation);

                window.webNotification.showNotification(1, 2, 3, 4, function () {
                    assert.fail();
                });

                setTimeout(function () {
                    done();
                }, 50);
            });

            it('null info', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(emptyValuesValidation);

                window.webNotification.showNotification(null, null, function onShow(error, hide) {
                    validShowValidation(error, hide, done);
                });
            });

            it('no callback', function (done) {
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

            it('no title', function (done) {
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

            it('with no icon', function (done) {
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

            it('no options', function (done) {
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

            it('first time permissions', function (done) {
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

            it('onClick', function (done) {
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

            it('error on new', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                var mockNotification = window.Notification;
                window.Notification = function () {
                    throw new Error('test');
                };

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: 'my-icon.ico'
                }, function onShow(error, hide) {
                    window.Notification = mockNotification;

                    errorValidation(error, hide || null, done);
                });
            });

            it('serviceWorkerRegistration valid', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.equal(options.body, 'Notification Text...');
                    assert.equal(options.icon, 'my-icon.ico');
                });

                var tag;

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: 'my-icon.ico',
                    serviceWorkerRegistration: {
                        showNotification: function (title, options) {
                            assert.equal(title, 'Example Notification');
                            assert.equal(options.body, 'Notification Text...');
                            assert.equal(options.icon, 'my-icon.ico');
                            assert.isDefined(options.tag);

                            tag = options.tag;

                            return {
                                then: function (callback) {
                                    setTimeout(callback, 10);

                                    return {
                                        catch: function () {
                                            return undefined;
                                        }
                                    };
                                }
                            };
                        },
                        getNotifications: function (options) {
                            assert.equal(options.tag, tag);

                            return {
                                then: function (callback) {
                                    setTimeout(function () {
                                        callback([
                                            {
                                                close: function () {
                                                    return undefined;
                                                }
                                            }
                                        ]);
                                    }, 10);

                                    return {
                                        catch: function (errorCB) {
                                            assert.isFunction(errorCB);
                                        }
                                    };
                                }
                            };
                        }
                    }
                }, function onShow(error, hide) {
                    validShowValidation(error, hide);

                    done();
                });
            });

            it('serviceWorkerRegistration with tag', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.equal(options.body, 'Notification Text...');
                    assert.equal(options.icon, 'my-icon.ico');
                    assert.equal(options.tag, '123');
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: 'my-icon.ico',
                    tag: '123',
                    serviceWorkerRegistration: {
                        showNotification: function (title, options) {
                            assert.equal(title, 'Example Notification');
                            assert.equal(options.body, 'Notification Text...');
                            assert.equal(options.icon, 'my-icon.ico');
                            assert.equal(options.tag, '123');

                            return {
                                then: function (callback) {
                                    setTimeout(callback, 10);

                                    return {
                                        catch: function () {
                                            return undefined;
                                        }
                                    };
                                }
                            };
                        },
                        getNotifications: function (options) {
                            assert.equal(options.tag, '123');

                            return {
                                then: function (callback) {
                                    setTimeout(function () {
                                        callback([
                                            {
                                                close: function () {
                                                    return undefined;
                                                }
                                            }
                                        ]);
                                    }, 10);

                                    return {
                                        catch: function (errorCB) {
                                            assert.isFunction(errorCB);
                                        }
                                    };
                                }
                            };
                        }
                    }
                }, function onShow(error, hide) {
                    validShowValidation(error, hide);

                    done();
                });
            });

            it('serviceWorkerRegistration no notifications', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.isDefined(options);
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    serviceWorkerRegistration: {
                        showNotification: function (title, options) {
                            assert.equal(title, 'Example Notification');
                            assert.isDefined(options);

                            return {
                                then: function (callback) {
                                    setTimeout(callback, 10);

                                    return {
                                        catch: function () {
                                            return undefined;
                                        }
                                    };
                                }
                            };
                        },
                        getNotifications: function (options) {
                            assert.isDefined(options.tag);

                            return {
                                then: function (callback) {
                                    setTimeout(function () {
                                        callback([]);
                                    }, 10);

                                    return {
                                        catch: function (errorCB) {
                                            assert.isFunction(errorCB);
                                        }
                                    };
                                }
                            };
                        }
                    }
                }, function onShow(error, hide) {
                    assert.isDefined(error);
                    assert.isUndefined(hide);

                    done();
                });
            });

            it('serviceWorkerRegistration show catch', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.isDefined(options);
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    serviceWorkerRegistration: {
                        showNotification: function (title, options) {
                            assert.equal(title, 'Example Notification');
                            assert.isDefined(options);

                            return {
                                then: function (validCB) {
                                    assert.isFunction(validCB);

                                    return {
                                        catch: function (errorCB) {
                                            setTimeout(function () {
                                                errorCB(new Error('test'));
                                            }, 10);
                                        }
                                    };
                                }
                            };
                        }
                    }
                }, function onShow(error, hide) {
                    assert.isDefined(error);
                    assert.equal(error.message, 'test');
                    assert.isUndefined(hide);

                    done();
                });
            });

            it('serviceWorkerRegistration get notifications catch', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setAllowed(function (title, options) {
                    assert.equal(title, 'Example Notification');
                    assert.isDefined(options);
                });

                window.webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    serviceWorkerRegistration: {
                        showNotification: function (title, options) {
                            assert.equal(title, 'Example Notification');
                            assert.isDefined(options);

                            return {
                                then: function (callback) {
                                    setTimeout(callback, 10);

                                    return {
                                        catch: function () {
                                            return undefined;
                                        }
                                    };
                                }
                            };
                        },
                        getNotifications: function (options) {
                            assert.isDefined(options.tag);

                            return {
                                then: function (validCB) {
                                    assert.isFunction(validCB);

                                    return {
                                        catch: function (errorCB) {
                                            setTimeout(function () {
                                                errorCB(new Error('test'));
                                            }, 10);
                                        }
                                    };
                                }
                            };
                        }
                    }
                }, function onShow(error, hide) {
                    assert.isDefined(error);
                    assert.equal(error.message, 'test');
                    assert.isUndefined(hide);

                    done();
                });
            });
        });

        describe('not allowed', function () {
            it('not allowed', function (done) {
                assert.isTrue(window.webNotification.lib.MOCK_NOTIFY);
                window.Notification.setNotAllowed();

                window.webNotification.showNotification('not allowed', {}, function onShow(error, hide) {
                    errorValidation(error, hide, done);
                });
            });

            it('not allowed to ask permissions', function (done) {
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
