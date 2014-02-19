/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Emergence.ext.proxy.Records', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.records',
    
    /**
     * @cfg The API wrapper singleton that will process requests
     * @required
     */
    apiWrapper: 'Emergence.util.API',

    /**
     * @cfg The base URL for the managed collection (e.g. '/people')
     * @required
     */
    url: null,

    idParam: 'ID',
    pageParam: false,
    startParam: 'offset',
    limitParam: 'limit',
    sortParam: 'sort',
    simpleSortMode: true,
    reader: {
        type: 'json',
        root: 'data',
        totalProperty: 'total'
    },
    writer:{
        type: 'json',
        root: 'data',
        writeAllFields: false,
        allowSingle: false
    },

    doRequest: function() {
        var me = this,
            apiWrapper = me.apiWrapper,
            doApiRequest = me.doApiRequest,
            requestArguments = arguments;

        // ensure apiWrapper is required and converted to instance before request is built
        if (typeof apiWrapper == 'string') {
            Ext.require(apiWrapper, function() {
                me.apiWrapper = Ext.ClassManager.get(apiWrapper);
                doApiRequest.apply(me, requestArguments);
            });
        } else {
            doApiRequest.apply(me, requestArguments);
        }
    },
    
    doApiRequest: function(operation, callback, scope) {
        var me = this,
            writer = me.getWriter(),
            request = me.buildRequest(operation);
            
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        
        me.getAPIWrapper().request(Ext.apply(request, {
            autoDecode: false,
            success: function(response) {
                me.processResponse(true, operation, request, response, callback, scope);
            }
        }));
    },

    getAPIWrapper: function() {
        return this.apiWrapper;
    },

    buildRequest: function(operation) {
        var me = this,
            params = operation.params = Ext.apply({}, operation.params, me.extraParams),
            request = new Ext.data.Request({
                action: operation.action,
                records: operation.records,
                operation: operation,
                params: Ext.applyIf(params, me.getParams(operation)),
                headers: me.headers
            });

        request.method = me.getMethod(request);
        request.url =me.buildUrl(request);

        return request;
    },

    buildUrl: function(request) {
        var me = this,
            baseUrl = me.getUrl(request) + '/json';

        switch(request.action) {
            case 'read':
                if (request.operation.id && (me.idParam == 'ID' || me.idParam == 'Handle')) {
                    baseUrl += '/' + encodeURIComponent(request.operation.id);
                }
                break;
            case 'create':
            case 'update':
                baseUrl += '/save';
                break;
            case 'destroy':
                baseUrl += '/destroy';
                break;
        }

        return baseUrl;
    },

    getParams: function(operation) {
        var me = this,
            idParam = me.idParam,
            params = me.callParent(arguments);

        if (operation.id && idParam != 'ID') {
            params[idParam] = operation.id;
        }
        
        return params;
    }
});