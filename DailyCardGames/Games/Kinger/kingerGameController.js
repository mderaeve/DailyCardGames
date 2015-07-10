'use strict';

angular.module('Games')

.controller('kingerGameController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc) {
        console.log('test');

        $scope.canInsertScore = true;
        
        $scope.player1 = $rootScope.currentPlayers[0];
        $scope.player2 = $rootScope.currentPlayers[1];
        $scope.player3 = $rootScope.currentPlayers[2];
        $scope.player4 = $rootScope.currentPlayers[3];

        initScores();


        $scope.insertScore = function () {
            console.log('insert score');
            //Check if the score is correct.


            var score = [$scope.newScore1, $scope.newScore2, $scope.newScore3, $scope.newScore4];
            //insert the score in the indexedDB
            indexedDBDataSvc.addScore(score, $rootScope.game.id).then(function () {
                refreshScores();
                $scope.newScore1 = 0;
                $scope.newScore2 = 0;
                $scope.newScore3 = 0;
                $scope.newScore4 = 0;
            }, function (err) {
                $window.alert(err);
            });
        };

        $scope.getScores = function () {
            getScores();
        };

        $scope.rules = function () {
            console.log('go to rules');
            $state.go('kingerrules');
        };

        $scope.stopGame = function () {
            $rootScope.currentPlayers = null;
            $rootScope.game.active = 0;
            indexedDBDataSvc.updateGame($rootScope.game).then(function (data) {
                $rootScope.game = null;
                $state.go('kinger');
            }, function (err) {
                $window.alert(err);
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
        };

        function initScores() {
 
            initScoreForPlayer($scope.player1);
            initScoreForPlayer($scope.player2);
            initScoreForPlayer($scope.player3);
            initScoreForPlayer($scope.player4);

            $scope.scores = [];
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
        /*function refreshScores() {
            indexedDBDataSvc.getScores($rootScope.game.id).then(function (data) {
                $scope.scores = data;
                $scope.scoresCollection = [].concat($scope.scores);
                //calculate totals
                $scope.player1.total = 0;
                $scope.player2.total = 0;
                $scope.player3.total = 0;
                $scope.player4.total = 0;
                data.forEach(function (score) {
                    $scope.player1.total += parseInt(score.score[0]);
                    $scope.player2.total += parseInt(score.score[1]);
                    $scope.player3.total += parseInt(score.score[2]);
                    $scope.player4.total += parseInt(score.score[3]);
                });

                checkColor($scope.player1.total, 1);
                checkColor($scope.player2.total, 2);
                checkColor($scope.player3.total, 3);
                checkColor($scope.player4.total, 4);


            }, function (err) {
                $window.alert(err);
            });
        };*/
        /*
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
            console.log(color);
            console.log(total);
        }

        //refreshScores();*/

    }]);