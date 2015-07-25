'use strict';

angular.module('Games')

.controller('kingerGameController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc) {
       
        $scope.canInsertScore = true;
        $scope.topScoreCount = 0;
        $scope.bottomScoreCount = 0;
        $scope.rules = function () {
            console.log('go to rules');
            $state.go('kingerrules');
        };
        if ($rootScope.game == null)
        {
            console.log('go to kinger home');
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
                console.log('Stop');
                $state.go('kinger');
            }, function (err) {
                console.log(err); //$window.alert(err);
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
            if ($scope.player1.turn == "underline") {
                $scope.player1.turn = "none";
                $scope.player2.turn = "underline";
                $scope.player3.turn = "none";
                $scope.player4.turn = "none";
            } else if ($scope.player2.turn == "underline") {
                $scope.player1.turn = "none";
                $scope.player2.turn = "none";
                $scope.player3.turn = "underline";
                $scope.player4.turn = "none";
            } else if ($scope.player3.turn == "underline") {
                $scope.player1.turn = "none";
                $scope.player2.turn = "none";
                $scope.player3.turn = "none";
                $scope.player4.turn = "underline";
            } else {
                $scope.player1.turn = "underline";
                $scope.player2.turn = "none";
                $scope.player3.turn = "none";
                $scope.player4.turn = "none";
            }
        };

     

    }]);