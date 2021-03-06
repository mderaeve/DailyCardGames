﻿'use strict';

angular.module('Games')

.controller('kingerGameController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc) {
       
        $scope.canInsertScore = true;
        $scope.topScoreCount = 0;
        $scope.bottomScoreCount = 0;
        $scope.rules = function () {
            $state.go('kingerrules');
        };
        if ($rootScope.game == null)
        {
            $state.go('kinger');
        }

        $scope.player1 = $rootScope.game.players[0];
        $scope.player2 = $rootScope.game.players[1];
        $scope.player3 = $rootScope.game.players[2];
        $scope.player4 = $rootScope.game.players[3];
      
        $scope.stopGame = function () {
            $rootScope.game.active = 0;
            indexedDBDataSvc.updateGame($rootScope.game).then(function (data) {
                $rootScope.game = null;
                //check if there are at least 4 players, else redirect to home
                indexedDBDataSvc.getPlayers().then(function (data) {
                    if (data != null && data.length > 3) {
                        $state.go('kinger');
                    }
                    else {
                        $state.go('home');
                    }
                }, function (err) {
                    console.log('Error get players',err);
                });
                
            }, function (err) {
                console.log('Error update game',err); //$window.alert(err);
            });
        };

        $scope.leaveTop = function (playerColumn)
        {
            var p;
            switch (playerColumn)
            {
                case 0: p = $scope.player1; break;
                case 1: p = $scope.player2; break;
                case 2: p = $scope.player3; break;
                case 3: p = $scope.player4; break;
            }

            p.totalTop = 0;
            for (var i = 0 ; i < 12; i++) {
                if (!isNaN(parseInt($rootScope.game.scores[i][playerColumn]))) p.totalTop += parseInt($rootScope.game.scores[i][playerColumn]);
            }

            calculateGrandTotal(p, playerColumn);
            $scope.topScoreCount = $scope.topScoreCount +1;
        };

        $scope.leaveBottom = function (playerColumn) {
            var p;
            switch (playerColumn) {
                case 0: p = $scope.player1; break;
                case 1: p = $scope.player2; break;
                case 2: p = $scope.player3; break;
                case 3: p = $scope.player4; break;
            }
            p.totalBottom = 0;
            for (var i = 12 ; i < 20; i++) {
                if (!isNaN(parseInt($rootScope.game.scores[i][playerColumn]))) p.totalBottom += parseInt($rootScope.game.scores[i][playerColumn]);
            }

            calculateGrandTotal(p, playerColumn);
            $scope.bottomScoreCount = $scope.bottomScoreCount + 1;
        };

        function calculateGrandTotal(player, playerColumn)
        {
            player.total = player.totalBottom - player.totalTop;
           

            //Update the game with the new score
            $rootScope.game.players[playerColumn] = player;

            indexedDBDataSvc.updateGame($rootScope.game).then(function (data) {
            }, function (err) {
                console.log(err); 
            });
        };

        $scope.changeTurn = function () {
            changeTurn();
            //Save the active player in de DB
            $rootScope.game.players[0] = $scope.player1;
            $rootScope.game.players[1] = $scope.player2;
            $rootScope.game.players[2] = $scope.player3;
            $rootScope.game.players[3] = $scope.player4;

            indexedDBDataSvc.updateGame($rootScope.game).then(function () {
            }, function (err) {
                console.log(err); 
            });
        };

        function changeTurn() {

            if ($scope.player1.turn == $rootScope.selectedPlayerColor) {
                $scope.player1.turn = "#FFFFFF";
                $scope.player2.turn = $rootScope.selectedPlayerColor;
                $scope.player3.turn = "#FFFFFF";
                $scope.player4.turn = "#FFFFFF";
            } else if ($scope.player2.turn == $rootScope.selectedPlayerColor) {
                $scope.player1.turn = "#FFFFFF";
                $scope.player2.turn = "#FFFFFF";
                $scope.player3.turn = $rootScope.selectedPlayerColor;
                $scope.player4.turn = "#FFFFFF";
            } else if ($scope.player3.turn == $rootScope.selectedPlayerColor) {
                $scope.player1.turn = "#FFFFFF";
                $scope.player2.turn = "#FFFFFF";
                $scope.player3.turn = "#FFFFFF";
                $scope.player4.turn = $rootScope.selectedPlayerColor;
            } else {
                $scope.player1.turn = $rootScope.selectedPlayerColor;
                $scope.player2.turn = "#FFFFFF";
                $scope.player3.turn = "#FFFFFF";
                $scope.player4.turn = "#FFFFFF";
            }
        };

     

    }]);