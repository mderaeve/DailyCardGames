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

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function (newValue) {
                        console.log(newValue);
                        if (isNaN(newValue))
                        {
                            console.log('Nan value inserted');
                            element.css('background', 'red');
                        }
                        else if (newValue > attrs.maxRowValue) {
                            console.log('too much data');
                            element.css('background', 'red');
                        }
                        else {
                                console.log('OK');
                                element.css('background', 'white');
                            }

                    });
                }
            }
            //    link: linker
            //}

            //function linker(scope, element, attrs) {
            //    console.log(attrs.ngModel);
            //    //scope.select = select;
            //    scope.scope = scope;
            //    //scope.selectedValue = "ACT";
        
            //    scope.$watch("model", function () {
            //        console.log("Changed", scope.ngModel);
            //        if (scope.ngModel > attrs.maxRowValue) {
            //                console.log('too much data');
            //                element.css('background', 'red');
            //            }
            //        else {
            //                 console.log('OK');
            //                element.css('background', 'white');
            //            }
            //    });
            //};

            //console.log('row max = ', attrs.maxRowValue);
                //link: function (scope, element, attrs, ngModel) {
                //    console.log('row max = ', attrs.maxRowValue);

                //    scope.$watch(function () { 'model' },
                //        function (newValue, oldValue) {
                //            console.log('Calculated in : ',oldValue,newValue);
                //            if (newValue !== oldValue) {
                //                //calculate();
                //                console.log('Calculated');
                //                if (newValue > attrs.ngModel) {
                //                    console.log('too much data');
                //                    element.css('background', 'red');
                //                }
                //                else {
                //                    element.css('background', 'white');
                //                }
                //            }
                //        }
                //     ,true);


                    //var unregister = scope.$watch(function () {
                    //    console.log(ngModel.$modelValue);
                    //    var totalSiblings=0;
                    //    //Check the input values inside
                    //    element.find('input').each(function () {
                    //        //your code here
                    //        //console.log(this.value);
                    //        totalSiblings = totalSiblings + parseInt(this.value);
                    //    });
                    //    console.log('totalsiblings ', totalSiblings);
                    //    if (totalSiblings > ngModel.$modelValue)
                    //    {
                    //        console.log('too much data');
                    //        element.css('background', 'red');
                    //    }
                    //    else {
                    //        element.css('background', 'white');
                    //    }
                    //    return ngModel.$modelValue;
                    //}, initialize);

                    //function initialize(value) {
                    //    ngModel.$setViewValue(value);
                    //    unregister();
                    //}
                    //function calculate()
                    //{
                    //    console.log(ngModel.$modelValue);
                    //        var totalSiblings=0;
                    //        //Check the input values inside
                    //        element.find('input').each(function () {
                    //            //your code here
                    //            //console.log(this.value);
                    //            totalSiblings = totalSiblings + parseInt(this.value);
                    //        });
                    //        console.log('totalsiblings ', totalSiblings);
                    //        if (totalSiblings > ngModel.$modelValue)
                    //        {
                    //            console.log('too much data');
                    //            element.css('background', 'red');
                    //        }
                    //        else {
                    //            element.css('background', 'white');
                    //        }
                    //};

                    //scope.$watch(function () { ngModel },
                    //    function (newValue, oldValue) {
                    //        console.log('Calculated in : ',oldValue,newValue);
                    //        if (newValue !== oldValue) {
                    //            calculate();
                    //            console.log('Calculated');
                    //        }
                    //    }
                    // ,true);
               
            
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