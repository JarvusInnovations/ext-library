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
