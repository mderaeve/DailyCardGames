'use strict';

angular.module('Home')
    /*
.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            
            element.bind('click', function() {
                if (element.attr("class") == "btn btn-default input-block-level form-control") {
                    element.removeClass("btn btn-default input-block-level form-control");
                    element.addClass(attrs.toggleClass);
                } else {
                    element.removeClass("btn btn-primary input-block-level form-control");
                    element.addClass("btn btn-default input-block-level form-control");
                }
            });
        }
    };
});*/
    .constant('keyCodes', {
        esc: 27,
        //space: 32,
        enter: 13,
        //tab: 9,
        //backspace: 8,
        //shift: 16,
        //ctrl: 17,
        //alt: 18,
        //capslock: 20,
        //numlock: 144
    })

    .directive('selectOnClick', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    if (!$window.getSelection().toString()) {
                        // Required for mobile Safari
                        this.setSelectionRange(0, this.value.length)
                    }
                });
            }
        };
    }])

   .directive('keyBind', ['keyCodes', function (keyCodes) {
        function map(obj) {
            var mapped = {};
            for (var key in obj) {
                var action = obj[key];
                if (keyCodes.hasOwnProperty(key)) {
                    mapped[keyCodes[key]] = action;
                }
            }
            return mapped;
        }

        return function (scope, element, attrs) {
            var bindings = map(scope.$eval(attrs.keyBind));
            element.bind("keypress", function (event) {
                if (bindings.hasOwnProperty(event.which)) {
                    scope.$apply(function ()
                    {
                        console.log(event);
                        scope.$eval(bindings[event.which]);
                    });
                }
            });
        };
    }]);