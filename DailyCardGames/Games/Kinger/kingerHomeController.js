'use strict';

angular.module('Games')

.controller('kingerHomeController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc) {

        $scope.fourPlayersSelected = false;
        $scope.players = [];
        $scope.selectedPlayers = [];
        $scope.kingerFull = false;
        checkActiveGame();
        

        $scope.refreshList = function () {
            indexedDBDataSvc.getPlayers().then(function (data) {
                $scope.players = data;
            }, function (err) {
                console.log(err);
                //$window.alert(err);
            });
        };

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
                player.number = index + 1;
                $scope.selectedPlayers.push(player);
            }
           
            console.log('number ' + player.number);

            if ($scope.selectedPlayers.length == 4) {
                $scope.fourPlayersSelected = true;
            }
            else {
                $scope.fourPlayersSelected = false;
            }
        };

        $scope.setGameType = function (value)
        {
            $scope.kingerFull = value;
        }

        $scope.startGame = function () {
            
            
            indexedDBDataSvc.addGame($scope.selectedPlayers, "kingen", $scope.kingerFull,0).then(function () 
            {

                indexedDBDataSvc.getActiveGame("kingen").then(function (data) {
                    if (data != null) {
                        //if there is an active game, redirect to the game
                        $rootScope.game = data;
                        initScores();
                    }
                }, function (err) {
                    console.log(err); //$window.alert(err);
                });
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
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
                    $scope.selectedPlayers = $rootScope.game.players;
                    if ($rootScope.game != null) {
                        $state.go('kingergame');
                    }

                }
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        }

        function initScores() {

            initScoreForPlayer($rootScope.game.players[0]);
            initScoreForPlayer($rootScope.game.players[1]);
            initScoreForPlayer($rootScope.game.players[2]);
            initScoreForPlayer($rootScope.game.players[3]);

            $rootScope.game.scores = [];
  
            for (var i = 0 ; i<20;i++)
            {
                $rootScope.game.scores.push([0, 0, 0, 0]);

            }

            $rootScope.game.players[0].turn = $rootScope.selectedPlayerColor;
            $rootScope.game.players[1].turn = "#FFFFFF";
            $rootScope.game.players[2].turn = "#FFFFFF";
            $rootScope.game.players[3].turn = "#FFFFFF";

            //update the game in the database
            indexedDBDataSvc.updateGame($rootScope.game).then(function (data) {
                $state.go('kingergame');
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
         
        };

        function initScoreForPlayer(player) {
            player.total = 0;
            player.totalTop = 0;
            player.totalBottom = 0;
        };

        init();

    }]);