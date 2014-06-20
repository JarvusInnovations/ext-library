/*jslint browser: true, undef: true*//*global Ext*/

/**
 * @abstract
 * An abstract class for singletons that facilitates communication with backend services on a local or remote emergence server
 */
Ext.define('Emergence.util.AbstractAPI', {
    extend: 'Jarvus.util.AbstractAPI',

    config: {
        sessionData: null
    },

    //@private
    constructor: function(config) {
        var me = this;

        me.callParent(arguments);

        me.addEvents(
            /**
             * @event
             * Fires after successful login
             * @param {Object} sessionData
             */
            'login'
        );
    },
    
    buildHeaders: function(headers) {
        headers = headers || {};

        if (!('Accept' in headers)) {
            headers.Accept = 'application/json';
        }

        return headers;
    },

    /**
     * Attempt to load session data
     * @param {String} hostname
     * @param {String} username
     * @param {String} password
     * @param {Function} callback A function to call and pass the new client data to when it is available
     * @param {Object} scope Scope for the callback function
     */
    getSessionData: function(callback, scope) {
        var me = this;

        me.request({
            url: '/login',
            method: 'GET',
            success: function(response) {
                if(response.data && response.data.success) {
                    me.setSessionData(response.data.data);
                    Ext.callback(callback, scope, [true, response]);
                    me.fireEvent('login', response.data.data);
                }
                else {
                    Ext.callback(callback, scope, [false, response]);
                }
            },
            exception: function(response) {
                Ext.callback(callback, scope, [false, response]);
            }
        });
    },

    /**
     * Login to a remote Slate instance
     * @param {String} hostname
     * @param {String} username
     * @param {String} password
     * @param {Function} callback A function to call and pass the new client data to when it is available
     * @param {Object} scope Scope for the callback function
     */
    login: function(username, password, callback, scope) {
        var me = this;

        me.request({
            url: '/login',
            params: {
                '_LOGIN[username]': username,
                '_LOGIN[password]': password,
                '_LOGIN[returnMethod]': 'POST'
            },
            success: function(response) {
                if (response.data && response.data.success) {
                    me.setSessionData(response.data.data);
                    Ext.callback(callback, scope, [true, response]);
                    me.fireEvent('login', response.data.data);
                } else {
                    Ext.callback(callback, scope, [false, response]);
                }
            },
            exception: function(response) {
                Ext.callback(callback, scope, [false, response]);
            }
        });
    },

    /**
     * Logout from remote Slate instance
     * @param {Function} callback A function to call and pass the new client data to when it is available
     * @param {Object} scope Scope for the callback function
     */
    logout: function(callback, scope) {
        this.request({
            url: '/login/logout',
            success: function(response) {
                Ext.callback(callback, scope, [true, response]);
            },
            exception: function(response) {
                Ext.callback(callback, scope, [false, response]);
            }
        });
    }
});