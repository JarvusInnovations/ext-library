/**
 * Utilities for handling external links in various browser environments
 */
Ext.define('Jarvus.util.ExternalBrowser', {
    singleton: true,
    
    /**
     * Open a link in a new tab/window via javascript
     */
    open: function(url) {
        if (!this.isHomescreenApp()) {
            window.open(url);
            return;
        }
        
        var anchorNode = document.createElement('a'),
            fakeEvent = document.createEvent("HTMLEvents");
            
        fakeEvent.initEvent('click', true, true);
            
        anchorNode.setAttribute('href', url);
        anchorNode.setAttribute('target', '_blank');
        anchorNode.dispatchEvent(fakeEvent);
    },
    
    /**
     * Finds any <a> tags within the passed DOM element and ensures their target="_blank" if
     * the href attribute doesn't start with #
     */
    patchTargets: function(dom) {
        dom = Ext.getDom(dom);
        var links, i = 0, linkNode;
        
        links = dom.querySelectorAll('a:not([href^="#"]):not([target=_blank])');
        for (; linkNode = links[i]; i++) {
            linkNode.target = '_blank';
        }
        
        return dom;
    },
    
    /**
     * Sets up a handler for external links on environments where special handling is needed to
     * launch links into external browser windows
     */
    setupLinkHandler: function() {
        if (!this.isHomescreenApp()) {
            Ext.getBody().on('click', function(ev, t) {
                t = ev.getTarget('a');
                window.open(t.href, t.target, 'location=no');
                ev.stopEvent();
            }, this, {delegate: 'a[target=_blank],a[target=_system]'});
        }
    },
    
    // @private
    isHomescreenApp: function() {
        return ('standalone' in navigator) && navigator.standalone;
    }
});
