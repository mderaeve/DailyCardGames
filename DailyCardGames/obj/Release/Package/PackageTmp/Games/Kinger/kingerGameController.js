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

        

       /* $scope.checkCanInsertScore = function () {
          

            var check = parseInt($scope.newScore1, 10) + parseInt($scope.newScore2, 10) + parseInt($scope.newScore3, 10) + parseInt($scope.newScore4, 10);
            console.log(check);
            if (check == 0) {
                $scope.canInsertScore = true;
            }
            else {
                $scope.canInsertScore = false;
                $scope.newScore4 = 0 - parseInt($scope.newScore1) - parseInt($scope.newScore2) - parseInt($scope.newScore3);
                $scope.canInsertScore = true;
            }
            console.log(check);

        };*/

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
        };

        function initScores() {

            $scope.player1.mhscore1 = 0;
            $scope.player1.mhscore2 = 0;
            $scope.player1.msscore1 = 0;
            $scope.player1.msscore2 = 0;
            $scope.player1.ghbscore1 = 0;
            $scope.player1.ghbscore2 = 0;
            $scope.player1.mdscore1 = 0;
            $scope.player1.mdscore2 = 0;
            $scope.player1.zlscore1 = 0;
            $scope.player1.zlscore2 = 0;
            $scope.player1.hhscore1 = 0;
            $scope.player1.hhscore2 = 0;

            $scope.player2.mhscore1 = 0;
            $scope.player2.mhscore2 = 0;
            $scope.player2.msscore1 = 0;
            $scope.player2.msscore2 = 0;
            $scope.player2.ghbscore1 = 0;
            $scope.player2.ghbscore2 = 0;
            $scope.player2.mdscore1 = 0;
            $scope.player2.mdscore2 = 0;
            $scope.player2.zlscore1 = 0;
            $scope.player2.zlscore2 = 0;
            $scope.player2.hhscore1 = 0;
            $scope.player2.hhscore2 = 0;

            $scope.player3.mhscore1 = 0;
            $scope.player3.mhscore2 = 0;
            $scope.player3.msscore1 = 0;
            $scope.player3.msscore2 = 0;
            $scope.player3.ghbscore1 = 0;
            $scope.player3.ghbscore2 = 0;
            $scope.player3.mdscore1 = 0;
            $scope.player3.mdscore2 = 0;
            $scope.player3.zlscore1 = 0;
            $scope.player3.zlscore2 = 0;
            $scope.player3.hhscore1 = 0;
            $scope.player3.hhscore2 = 0;

            $scope.player4.mhscore1 = 0;
            $scope.player4.mhscore2 = 0;
            $scope.player4.msscore1 = 0;
            $scope.player4.msscore2 = 0;
            $scope.player4.ghbscore1 = 0;
            $scope.player4.ghbscore2 = 0;
            $scope.player4.mdscore1 = 0;
            $scope.player4.mdscore2 = 0;
            $scope.player4.zlscore1 = 0;
            $scope.player4.zlscore2 = 0;
            $scope.player4.hhscore1 = 0;
            $scope.player4.hhscore2 = 0;

            $scope.player1.total = 0;
            $scope.player2.total = 0;
            $scope.player3.total = 0;
            $scope.player4.total = 0;

            $scope.player1.totalTop = 0;
            $scope.player2.totalTop = 0;
            $scope.player3.totalTop = 0;
            $scope.player4.totalTop = 0;
            $scope.player1.totalBottom = 0;
            $scope.player2.totalBottom = 0;
            $scope.player3.totalBottom = 0;
            $scope.player4.totalBottom = 0;

            $scope.scores = [];
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