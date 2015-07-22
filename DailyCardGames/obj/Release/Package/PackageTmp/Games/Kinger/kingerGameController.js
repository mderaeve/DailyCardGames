'use strict';

angular.module('Games')

.controller('kingerGameController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc) {
       
        $scope.canInsertScore = true;

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
       
        checkColor($scope.player1.total, 1);
        checkColor($scope.player2.total, 2);
        checkColor($scope.player3.total, 3);
        checkColor($scope.player4.total, 4);

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
                case 1: p = $scope.player1; break;
                case 2: p = $scope.player2; break;
                case 3: p = $scope.player3; break;
                case 4: p = $scope.player4; break;
            }

            p.totalTop = 0;
            if (!isNaN(parseInt(p.mhscore1))) p.totalTop += parseInt(p.mhscore1);
            if (!isNaN(parseInt(p.mhscore2))) p.totalTop += parseInt(p.mhscore2);
            if (!isNaN(parseInt(p.msscore1))) p.totalTop += parseInt(p.msscore1);
            if (!isNaN(parseInt(p.msscore2))) p.totalTop += parseInt(p.msscore2);
            if (!isNaN(parseInt(p.ghbscore1))) p.totalTop += parseInt(p.ghbscore1);
            if (!isNaN(parseInt(p.ghbscore2))) p.totalTop += parseInt(p.ghbscore2);
            if (!isNaN(parseInt(p.mdscore1))) p.totalTop += parseInt(p.mdscore1);
            if (!isNaN(parseInt(p.mdscore2))) p.totalTop += parseInt(p.mdscore2);
            if (!isNaN(parseInt(p.zlscore1))) p.totalTop += parseInt(p.zlscore1);
            if (!isNaN(parseInt(p.zlscore2))) p.totalTop += parseInt(p.zlscore2);
            if (!isNaN(parseInt(p.hhscore1))) p.totalTop += parseInt(p.hhscore1);
            if (!isNaN(parseInt(p.hhscore2))) p.totalTop += parseInt(p.hhscore2);
            calculateGrandTotal();
        };

        $scope.leaveBottom = function (playerColumn) {
            var p;
            switch (playerColumn) {
                case 1: p = $scope.player1; break;
                case 2: p = $scope.player2; break;
                case 3: p = $scope.player3; break;
                case 4: p = $scope.player4; break;
            }
            p.totalBottom = 0;
            if (!isNaN(parseInt(p.troev1))) p.totalBottom += parseInt(p.troev1);
            if (!isNaN(parseInt(p.troev2))) p.totalBottom += parseInt(p.troev2);
            if (!isNaN(parseInt(p.troev3))) p.totalBottom += parseInt(p.troev3);
            if (!isNaN(parseInt(p.troev4))) p.totalBottom += parseInt(p.troev4);
            if (!isNaN(parseInt(p.troev5))) p.totalBottom += parseInt(p.troev5);
            if (!isNaN(parseInt(p.troev6))) p.totalBottom += parseInt(p.troev6);
            if (!isNaN(parseInt(p.troev7))) p.totalBottom += parseInt(p.troev7);
            if (!isNaN(parseInt(p.troev8))) p.totalBottom += parseInt(p.troev8);
            calculateGrandTotal();
        };

        function calculateGrandTotal()
        {
            $scope.player1.total = $scope.player1.totalBottom - $scope.player1.totalTop;
            $scope.player2.total = $scope.player2.totalBottom - $scope.player2.totalTop;
            $scope.player3.total = $scope.player3.totalBottom - $scope.player3.totalTop;
            $scope.player4.total = $scope.player4.totalBottom - $scope.player4.totalTop;

            //Update the game with the new score
            $rootScope.game.players[0] = $scope.player1;
            $rootScope.game.players[1] = $scope.player2;
            $rootScope.game.players[2] = $scope.player3;
            $rootScope.game.players[3] = $scope.player4;

            checkColor($scope.player1.total, 1);
            checkColor($scope.player2.total, 2);
            checkColor($scope.player3.total, 3);
            checkColor($scope.player4.total, 4);

            indexedDBDataSvc.updateGame($rootScope.game).then(function (data) {
            }, function (err) {
                console.log(err); //$window.alert(err);
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
                console.log(err); //$window.alert(err);
            });
        };

        $scope.mhTotal1Check = function () {
            $scope.mhTotal1 = parseInt($scope.player1.mhscore1) + parseInt($scope.player2.mhscore1) + parseInt($scope.player3.mhscore1) + parseInt($scope.player4.mhscore1);
        };

        $scope.mhTotal2Check = function () {
            $scope.mhTotal2 = parseInt($scope.player1.mhscore2) + parseInt($scope.player2.mhscore2) + parseInt($scope.player3.mhscore2) + parseInt($scope.player4.mhscore2);
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

       
        
        function checkColor(total, player) {
            var color;
            if (parseInt(total) > 0) {
                color = "green";
            }
            else if (parseInt(total) < 0) {
                color = "red";
            }
            else {
                color = "black";
            }
            switch (player) {
                case 1: $scope.player1Total = color;
                case 2: $scope.player2Total = color;
                case 3: $scope.player3Total = color;
                case 4: $scope.player4Total = color;
            }
        };

        function init() {
            $scope.mhTotal1Check();
            $scope.mhTotal2Check();
        };

        init();

    }]);