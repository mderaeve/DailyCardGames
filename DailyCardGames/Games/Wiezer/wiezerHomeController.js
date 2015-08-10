'use strict';

angular.module('Games')

.controller('wiezerHomeController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state,  $window, indexedDBDataSvc) {

        
        $scope.fourPlayersSelected = false;
        $scope.players = [];
        $scope.selectedPlayers = [];

        checkActiveGame();
        
        $scope.refreshList = function () {
            indexedDBDataSvc.getPlayers().then(function (data) {
                $scope.players = data;
            }, function (err) {
                console.log(err);// $window.alert(err);
            });
        };

        function init() {
            indexedDBDataSvc.open().then(function () {
                $scope.refreshList();
            });
        };

        function checkActiveGame()
        {
            indexedDBDataSvc.getActiveGame("wiezen").then(function (data) {
                if (data != null) {
                    //if there is an active game, redirect to the game
                    $rootScope.game = data;
                    if ($rootScope.game.scores == null)
                    {
                        console.log('init scores');
                        $rootScope.game.scores = [];
                    }
                    $state.go('wiezergame');
                }


            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        }

        $scope.selectPlayer = function (player) {
            
            //Check if the player is in the list
            if ($scope.selectedPlayers != null) {
                var index = 0;
                var removed = false;
                var p;
                for (p in $scope.selectedPlayers) {
                    if ($scope.selectedPlayers[p].id == player.id) {
                        $scope.selectedPlayers.splice(index, 1);
                        player.number = 0;
                        removed = true;
                    }
                    index++;
                }
            };
            
            if (removed == false) {
                player.number = index+1;
                $scope.selectedPlayers.push(player);
                //set the counter
            }


            if ($scope.selectedPlayers.length == 4) {
                $scope.fourPlayersSelected = true;
            }
            else {
                $scope.fourPlayersSelected = false;
            }
        };

        $scope.startGame = function () {
            console.log('Start wiezer');
            $scope.selectedPlayers[0].turn = "underline";
            $scope.selectedPlayers[1].turn = "none";
            $scope.selectedPlayers[2].turn = "none";
            $scope.selectedPlayers[3].turn = "none";
            indexedDBDataSvc.addGame($scope.selectedPlayers, "wiezen", false).then(function () {
                checkActiveGame();
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        };

        init();

    }]);