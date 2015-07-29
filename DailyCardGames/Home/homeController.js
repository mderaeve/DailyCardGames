'use strict';

angular.module('Home')

.controller('homeController',
    ['$scope', '$rootScope', '$state', '$stateParams','$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $stateParams, $window, indexedDBDataSvc) {
        $rootScope.canPlay = false;
        $scope.players = [];
        $scope.refreshList = function () {
            indexedDBDataSvc.getPlayers().then(function (data) {
                $scope.players = data;
                
                if (data != null && $scope.players.length > 3) {
                    $rootScope.canPlayKingen = true;
                    $rootScope.canPlayWiezen = true;
                }
                else
                {
                    $rootScope.canPlayKingen = false;
                    $rootScope.canPlayWiezen = false;
                    //kijken als er een actief spel is.
                    indexedDBDataSvc.getActiveGame("kingen").then(function (data) {
                        if (data != null) {
                            //if there is an active game, redirect to the game
                            $rootScope.canPlayKingen = true;
                        }
                    }, function (err) {
                        console.log(err); //$window.alert(err);
                    });
                    
                    indexedDBDataSvc.getActiveGame("wiezen").then(function (data) {
                        if (data != null) {
                            //if there is an active game, redirect to the game
                            $rootScope.canPlayWiezen = true;
                        }
                    }, function (err) {
                        console.log(err); //$window.alert(err);
                    });

                }
;            }, function (err) {
    console.log(err);// $window.alert(err);
            });
        };

        $scope.addPlayer = function ()
        {
            indexedDBDataSvc.addPlayer($scope.playerText).then(function () {
                $scope.refreshList();
                $scope.playerText = "";
            }, function (err) {
                console.log(err);// $window.alert(err);
            });
        };

        $scope.deletePlayer = function (id) {
            indexedDBDataSvc.deletePlayer(id).then(function () {
                $scope.refreshList();
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        };

        function init() {
            indexedDBDataSvc.open().then(function () {
                $scope.refreshList();
                console.log('init');
            });
        }

        init();

    }]);


