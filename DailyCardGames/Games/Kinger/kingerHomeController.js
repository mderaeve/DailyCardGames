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

        $scope.refreshList = function () {
            indexedDBDataSvc.getPlayers().then(function (data) {
                $scope.players = data;
                console.log('getPlayers');
                ;
            }, function (err) {
                console.log(err);
                //$window.alert(err);
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
            initScores();
            indexedDBDataSvc.addGame($scope.selectedPlayers, "kingen", $scope.kingerFull).then(function () {
                checkActiveGame();
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
                    console.log('Game id' + $rootScope.game.id);
                    $scope.selectedPlayers = $rootScope.game.players;
                    $state.go('kingergame');
                }


            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        }

        function initScores() {
         

            initScoreForPlayer( $scope.selectedPlayers[0]);
            initScoreForPlayer( $scope.selectedPlayers[1]);
            initScoreForPlayer( $scope.selectedPlayers[2]);
            initScoreForPlayer( $scope.selectedPlayers[3]);

            $scope.selectedPlayers[0].turn = "underline";
            $scope.selectedPlayers[1].turn = "none";
            $scope.selectedPlayers[2].turn = "none";
            $scope.selectedPlayers[3].turn = "none";
         
        };

        function initScoreForPlayer(player) {
            player.mhscore1 = 0;
            player.mhscore2 = 0;
            player.msscore1 = 0;
            player.msscore2 = 0;
            player.ghbscore1 = 0;
            player.ghbscore2 = 0;
            player.mdscore1 = 0;
            player.mdscore2 = 0;
            player.zlscore1 = 0;
            player.zlscore2 = 0;
            player.hhscore1 = 0;
            player.hhscore2 = 0;

            player.troev1 = 0;
            player.troev2 = 0;
            player.troev3 = 0;
            player.troev4 = 0;
            player.troev5 = 0;
            player.troev6 = 0;
            player.troev7 = 0;
            player.troev8 = 0;

            player.total = 0;
            player.totalTop = 0;
            player.totalBottom = 0;

        };



        init();

    }]);