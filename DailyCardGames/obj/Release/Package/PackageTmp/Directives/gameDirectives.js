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

     .directive('bootstrapSwitch', [
        function() {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function(scope, element, attrs, ngModel) {
                    element.bootstrapSwitch();
 
                    element.on('switchChange.bootstrapSwitch', function(event, state) {
                        if (ngModel) {
                            scope.$apply(function() {
                                ngModel.$setViewValue(state);
                            });
                        }
                    });
 
                    scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                        if (newValue) {
                            element.bootstrapSwitch('state', true, true);
                        } else {
                            element.bootstrapSwitch('state', false, true);
                        }
                    });
                }
            };
        }
     ])

     .directive('maxRowValue', [
        function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attrs, ngModel) {
                    //scope.isVisible = true;
                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function (newValue) {
                        //console.log(newValue);
                        //console.log(attrs.rowValue);
                        //console.log('value in $root', scope.$root.game.scores[attrs.rowNumber][0]);

                        var totalRow = 0;
                        var goOn = true;
                        for (var i = 0 ; i < 4; i++) {
                            if (!isNaN(parseInt(scope.$root.game.scores[attrs.rowNumber][i]))) {
                                totalRow += parseInt(scope.$root.game.scores[attrs.rowNumber][i]);
                            }
                            else {
                                console.log('Nan value inserted');
                                goOn = false;
                                break;
                            }
                        }

                        if (goOn == true && totalRow < attrs.rowValue)
                        {
                            console.log('OK');
                            element.css('background', 'white');
                        }
                        else if (goOn == true && totalRow == attrs.rowValue)
                        {
                            console.log('Complete');
                            element.css('background', 'green');
                        }
                        else
                        {
                            console.log('Row values not correct');
                            element.css('background', 'red');
                        }
                    });
                }
            }
        }
     ])

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