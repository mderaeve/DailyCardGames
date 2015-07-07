'use strict';

angular.module('Games')

.controller('kingerHomeController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc) {


        $scope.fourPlayersSelected = false;
        $scope.players = [];
        $scope.selectedPlayers = [];
        console.log('kinger');
        $scope.kingerFull = false;
        checkActiveGame();


        if ($rootScope.currentPlayers != null) {
            $scope.fourPlayersSelected = true;
            $scope.selectedPlayers = $rootScope.currentPlayers;

        }

        $scope.refreshList = function () {
            indexedDBDataSvc.getPlayers().then(function (data) {
                $scope.players = data;
                console.log('getPlayers');
                ;
            }, function (err) {
                $window.alert(err);
            });
        };

        $scope.isSelected = function (player) {
            var p;
            for (p in $scope.selectedPlayers) {
                if ($scope.selectedPlayers[p].id == player.id) {
                    console.log('selected');
                    return true
                }
            }
            return false;
        };

        function init() {
            indexedDBDataSvc.open().then(function () {
                $scope.refreshList();
                console.log('init');
            });
        };

        function checkActiveGame() {
            indexedDBDataSvc.getActiveGame("kingen").then(function (data) {
                if (data != null) {
                    //if there is an active game, redirect to the game
                    $rootScope.game = data;
                    console.log('Game id' + $rootScope.game.id);
                    $rootScope.currentPlayers = $rootScope.game.players;
                    $state.go('kingergame');
                }


            }, function (err) {
                $window.alert(err);
            });
        }

        $scope.selectPlayer = function (player) {
            console.log('push player: ' + player);

            //Check if the player is in the list
            if ($scope.selectedPlayers != null) {
                var index = 0;
                var removed = false;
                var p;
                for (p in $scope.selectedPlayers) {
                    if ($scope.selectedPlayers[p].id == player.id) {
                        $scope.selectedPlayers.splice(index, 1);
                        removed = true;
                    }
                    index++;
                }
            };

            if (removed == false) {
                $scope.selectedPlayers.push(player);
            }

            console.log('Length ' + $scope.selectedPlayers.length);

            if ($scope.selectedPlayers.length == 4) {
                $scope.fourPlayersSelected = true;
            }
            else {
                $scope.fourPlayersSelected = false;
            }
        };

        $scope.startGame = function () {
            console.log('Start Kingen');
            $rootScope.currentPlayers = $scope.selectedPlayers;
            indexedDBDataSvc.addGame($scope.selectedPlayers, "kingen", $scope.kingerFull).then(function () {
                checkActiveGame();
            }, function (err) {
                $window.alert(err);
            });
        };

        init();

    }]);