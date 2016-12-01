/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
;
(function(window) {

    'use strict';

    // Helper vars and functions.
    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    // from http://www.quirksmode.org/js/events_properties.html#position
    function getMousePos(e) {
        var posx = 0,
            posy = 0;
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return {
            x: posx,
            y: posy
        }
    }

    /**
     * TiltFx obj.
     */
    function TiltFx(el, options) {
        this.DOM = {};
        this.DOM.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    TiltFx.prototype.options = {
        movement: {
            wrapper: {
                translation: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                rotation: {
                    x: -10,
                    y: 10,
                    z: 0
                },
                reverseAnimation: {
                    duration: 300,
                    easing: 'easeOutElastic',
                    elasticity: 600
                }
            },
            title: {
                translation: {
                    x: 25,
                    y: 25,
                    z: 0
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                reverseAnimation: {
                    duration: 600,
                    easing: 'easeOutElastic',
                    elasticity: 600
                }
            },
            description: {
                translation: {
                    x: 15,
                    y: 15,
                    z: 0
                },
                reverseAnimation: {
                    duration: 300,
                    easing: 'easeOutElastic',
                    elasticity: 600
                }
            },
            type: {
                translation: {
                    x: 15,
                    y: 15,
                    z: 0
                },
                reverseAnimation: {
                    duration: 300,
                    easing: 'easeOutElastic',
                    elasticity: 600
                }
            },
            cover: {
                translation: {
                    x: 10,
                    y: 10,
                    z: 0
                },
                reverseAnimation: {
                    duration: 300,
                    easing: 'easeOutElastic',
                    elasticity: 600
                }
            }
        }
    };

    /**
     * Init.
     */
    TiltFx.prototype._init = function() {
        this.DOM.animatable = {};
        this.DOM.animatable.wrapper = this.DOM.el.querySelector('.m-item__container');
        this.DOM.animatable.title = this.DOM.el.querySelector('.m-item__title');
        this.DOM.animatable.description = this.DOM.el.querySelector('.m-item__description');
        this.DOM.animatable.type = this.DOM.el.querySelector('.m-item__type');
        this.DOM.animatable.cover = this.DOM.el.querySelector('.m-item__cover');
        this._initEvents();
    };

    /**
     * Init/Bind events.
     */
    TiltFx.prototype._initEvents = function() {
        var self = this;

        this.mouseenterFn = function() {
            for (var key in self.DOM.animatable) {
                anime.remove(self.DOM.animatable[key]);
            }
        };

        this.mousemoveFn = function(ev) {
            requestAnimationFrame(function() {
                self._layout(ev);
            });
        };

        this.mouseleaveFn = function(ev) {
            requestAnimationFrame(function() {
                for (var key in self.DOM.animatable) {
                    if (self.options.movement[key] == undefined) {
                        continue;
                    }
                    anime({
                        targets: self.DOM.animatable[key],
                        duration: self.options.movement[key].reverseAnimation != undefined ? self.options.movement[key].reverseAnimation.duration || 0 : 1,
                        easing: self.options.movement[key].reverseAnimation != undefined ? self.options.movement[key].reverseAnimation.easing || 'linear' : 'linear',
                        elasticity: self.options.movement[key].reverseAnimation != undefined ? self.options.movement[key].reverseAnimation.elasticity || null : null,
                        scaleX: 1,
                        scaleY: 1,
                        scaleZ: 1,
                        translateX: 0,
                        translateY: 0,
                        translateZ: 0,
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0
                    });
                }
            });
        };

        this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
    };

    TiltFx.prototype._layout = function(ev) {
        // Mouse position relative to the document.
        var mousepos = getMousePos(ev),
            // Document scrolls.
            docScrolls = {
                left: document.body.scrollLeft + document.documentElement.scrollLeft,
                top: document.body.scrollTop + document.documentElement.scrollTop
            },
            bounds = this.DOM.el.getBoundingClientRect(),
            // Mouse position relative to the main element (this.DOM.el).
            relmousepos = {
                x: mousepos.x - bounds.left - docScrolls.left,
                y: mousepos.y - bounds.top - docScrolls.top
            };

        // Movement settings for the animatable elements.
        for (var key in this.DOM.animatable) {
            if (this.DOM.animatable[key] == undefined || this.options.movement[key] == undefined) {
                continue;
            }
            var t = this.options.movement[key] != undefined ? this.options.movement[key].translation || {
                    x: 0,
                    y: 0,
                    z: 0
                } : {
                    x: 0,
                    y: 0,
                    z: 0
                },
                r = this.options.movement[key] != undefined ? this.options.movement[key].rotation || {
                    x: 0,
                    y: 0,
                    z: 0
                } : {
                    x: 0,
                    y: 0,
                    z: 0
                },
                setRange = function(obj) {
                    for (var k in obj) {
                        if (obj[k] == undefined) {
                            obj[k] = [0, 0];
                        } else if (typeof obj[k] === 'number') {
                            obj[k] = [-1 * obj[k], obj[k]];
                        }
                    }
                };

            setRange(t);
            setRange(r);

            var transforms = {
                translation: {
                    x: (t.x[1] - t.x[0]) / bounds.width * relmousepos.x + t.x[0],
                    y: (t.y[1] - t.y[0]) / bounds.height * relmousepos.y + t.y[0],
                    z: (t.z[1] - t.z[0]) / bounds.height * relmousepos.y + t.z[0],
                },
                rotation: {
                    x: (r.x[1] - r.x[0]) / bounds.height * relmousepos.y + r.x[0],
                    y: (r.y[1] - r.y[0]) / bounds.width * relmousepos.x + r.y[0],
                    z: (r.z[1] - r.z[0]) / bounds.width * relmousepos.x + r.z[0]
                }
            };

            this.DOM.animatable[key].style.WebkitTransform = this.DOM.animatable[key].style.transform = 'translateX(' + transforms.translation.x + 'px) translateY(' + transforms.translation.y + 'px) translateZ(' + transforms.translation.z + 'px) rotateX(' + transforms.rotation.x + 'deg) rotateY(' + transforms.rotation.y + 'deg) rotateZ(' + transforms.rotation.z + 'deg)';
        }
    };

    window.TiltFx = TiltFx;

})(window);


function initializeTilt(callback) {
    var tiltSettings = [];

    function init() {
        var idx = 0;
        [].slice.call(document.querySelectorAll('.m-item')).forEach(function(el, pos) {
            idx = pos % 2 === 0 ? idx + 1 : idx;
            new TiltFx(el, tiltSettings[idx - 1]);
        });
    }

    init();

    if (callback) {
      callback();
    }
};
