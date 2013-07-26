/**
 * Fixes issue where pullrefresh widget can get stuck hanging over list after
 * rapid down-scroll on device
 * 
 * See http://www.sencha.com/forum/showthread.php?268710-2.2.1-PullRefresh-widget-can-get-stuck-if-you-scroll-down-after-release&p=984392
 */
Ext.define('Jarvus.touch.patch.StickyPullRefresh', {
    override: 'Ext.plugin.PullRefresh',

    onScrollChange: function(scroller, x, y) {
        var me = this,
            tr = me.getTranslatable();
        
        me.callParent(arguments);
        
        // ensure pullrefresh widget is hidden when list gets scrolled
        if (y > 0 && tr.y > 0) {
            tr.translate(0, 0);
        }
    }
});
