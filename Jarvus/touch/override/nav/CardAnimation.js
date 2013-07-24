/**
 * Animation enhancements for NavigationView:
 *  - Each card in a navigationview may implement a navAnimation config or getNavAnimation function to override the layout's default animation
 *  - The new events 'enterscreen' and 'leavescreen' are fired on each card after their transition animation is complete
 *  - The new event 'transitioncomplete' is fired on the navigation view after a transition animation is complete
 */
Ext.define('Jarvus.touch.override.nav.CardAnimation', {
    override: 'Ext.navigation.View',
    uses: [
        'Ext.fx.layout.Card'
    ],
    
    transitionEventDelay: 10, // TODO: should this be a config?

    /**
     * Optionally return a special animation for the given navigation
     */
    getNavAnimation: function(incomingItem, outgoingItem, reverse) {
        var animItem = reverse ? outgoingItem : incomingItem,
            animation = null;
        
        if (animItem.getNavAnimation) {
            animation = animItem.getNavAnimation();
        }

        if (animation && !animation.isAnimation) {
            animation = new Ext.fx.layout.Card(animation);
        }
        
        return animation;
    },
    
    onItemAdd: function(incomingItem, index) {
        var me = this,
            outgoingItem = me.getActiveItem(),
            animation, isDefaultAnimation = false,
            onAnimationEnd;
            
        onAnimationEnd = function() {
            outgoingItem.fireEvent('leavescreen', outgoingItem, incomingItem, me);
            incomingItem.fireEvent('enterscreen', incomingItem, outgoingItem, me);
            me.fireEvent('transitioncomplete', me, incomingItem, outgoingItem);
        };
        
        me.doItemLayoutAdd(incomingItem, index);
        
        if (!me.isItemsInitializing && incomingItem.isInnerItem()) {
            animation = me.getNavAnimation(incomingItem, outgoingItem);
            
            if (!animation) {
                animation = me.getLayout().getAnimation();
                isDefaultAnimation = true;
            }
            
            if (animation && animation.isAnimation) {
                animation.on('animationend', onAnimationEnd, me, {single: true, delay: me.transitionEventDelay });
            }
            
            if (animation && animation.isAnimation && !isDefaultAnimation) {
                me.animateActiveItem(incomingItem, animation);
            } else {
                me.setActiveItem(incomingItem);
                
                if (!animation || !animation.isAnimation) {
                    Ext.defer(onAnimationEnd, me.transitionEventDelay);
                }
            }
            
            me.getNavigationBar().onViewAdd(me, incomingItem, index);
        }
        
        if (me.initialized) {
            me.fireEvent('add', me, incomingItem, index);
        }
    },

    ,doResetActiveItem: function(innerIndex) {
        var me = this,
            innerItems = me.getInnerItems(),
            outgoingItem, incomingItem,
            animation, isDefaultAnimation = false,
            onAnimationEnd;
            
        if (innerIndex > 0) {
            outgoingItem = innerItems[innerIndex];
            incomingItem = innerItems[innerIndex - 1];
            onAnimationEnd = function() {
                outgoingItem.fireEvent('leavescreen', outgoingItem, incomingItem, me);
                incomingItem.fireEvent('enterscreen', incomingItem, outgoingItem, me);
                me.fireEvent('transitioncomplete', me, incomingItem, outgoingItem);
            };
            
            animation = me.getNavAnimation(incomingItem, outgoingItem, true);
            
            if (animation) {
                // apply advanced reversing to view-provided animation
                if (animation.$className == 'Ext.fx.layout.card.Cover') {
                    animation = Ext.create('Ext.fx.layout.card.Reveal', {
                        direction: animation.getDirection()
                    });
                } else if (animation.$className == 'Ext.fx.layout.card.Reveal') {
                    animation = Ext.create('Ext.fx.layout.card.Cover', {
                        direction: animation.getDirection()
                    });
                }
            } else {
                animation = me.getLayout().getAnimation();
                isDefaultAnimation = true;
            }
            
            if(animation && animation.isAnimation) {
                animation.setReverse(true);
                animation.on('animationend', onAnimationEnd, me, {single: true, delay: me.transitionEventDelay});
            }
            
            if (animation && animation.isAnimation && !isDefaultAnimation) {
                me.animateActiveItem(incomingItem, animation);
            } else {
                me.setActiveItem(incomingItem);
                
                if (!animation || !animation.isAnimation) {
                    Ext.defer(onAnimationEnd, me.transitionEventDelay);
                }
            }
            
            me.getNavigationBar().onViewRemove(me, outgoingItem, innerIndex);
        }
    }
});
