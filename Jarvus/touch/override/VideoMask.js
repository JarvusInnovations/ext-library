/**
 * Disables controls on <video> when a mask is shown, to avoid having the video
 * swallow all touch events, and re-enables them on hide.
 *
 * Written for ST 2.1.1, may need to be adjusted for newer framework versions.
 */

Ext.define('Jarvus.touch.override.VideoMask', {
    override: 'Ext.Mask',
    
    initialize: function() {
        this.callParent();

        this.on({
            show: 'onShow',
            hide: 'onHide'
        });
    },
    
    onHide: function() {
        var videosWithDisabledControls = Ext.select('video[controls-disabled]');
        if (videosWithDisabledControls.getCount() > 0) {
            videosWithDisabledControls.each(function(el){

                var elDom = el.dom;
                elDom.setAttribute('controls', true);
                elDom.removeAttribute('controls-disabled');
            });
        }
    },
    
    onShow: function() {
        var videosWithControls = Ext.select('video[controls]');
        if (videosWithControls.getCount() > 0) {
            videosWithControls.each(function(el){

                var elDom = el.dom;
                elDom.setAttribute('controls-disabled', true);
                elDom.removeAttribute('controls');
            });
        }
    }
});