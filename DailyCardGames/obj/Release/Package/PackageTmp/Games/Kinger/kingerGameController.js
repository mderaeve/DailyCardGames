'use strict';

angular.module('Games')

.controller('kingerGameController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc) {
        console.log('test');

        $scope.canInsertScore = true;
        $scope.newScore1 = 0;
        $scope.newScore2 = 0;
        $scope.newScore3 = 0;
        $scope.newScore4 = 0;
        console.log($rootScope.currentPlayers);
        $scope.player1 = $rootScope.currentPlayers[0];
        $scope.player1.total = 0;
        $scope.player2 = $rootScope.currentPlayers[1];
        $scope.player2.total = 0;
        $scope.player3 = $rootScope.currentPlayers[2];
        $scope.player3.total = 0;
        $scope.player4 = $rootScope.currentPlayers[3];
        $scope.player4.total = 0;

        $scope.scores = [];
        $scope.scoreCollection = [];

        $scope.checkCanInsertScore = function () {
            console.log(parseInt($scope.newScore1, 10));
            console.log(parseInt($scope.newScore2, 10));
            console.log(parseInt($scope.newScore3, 10));
            console.log(parseInt($scope.newScore4, 10));

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

        };

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
            console.log('stop');
            $rootScope.currentPlayers = null;
            $rootScope.game.active = 0;
            indexedDBDataSvc.updateGame($rootScope.game).then(function (data) {
                $rootScope.game = null;
                console.log('go back');
                $state.go('wiezer');
            }, function (err) {
                $window.alert(err);
            });
        };

        function refreshScores() {
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
            console.log(color);
            console.log(total);
        }

        refreshScores();

    }]);