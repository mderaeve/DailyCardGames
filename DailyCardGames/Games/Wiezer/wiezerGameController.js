'use strict';

angular.module('Games')

.controller('wiezerGameController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc)
    {
        console.log('test');

        
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
        refreshScores();

        $scope.insertScore = function () {
            console.log('insert score');
            var score = [$scope.newScore1, $scope.newScore2, $scope.newScore3, $scope.newScore4];
            //insert the score in the indexedDB
            indexedDBDataSvc.addScore(score,$rootScope.game.Id).then(function () {
                refreshScores();
                $scope.newScore1 = 0;
                $scope.newScore2 = 0;
                $scope.newScore3 = 0;
                $scope.newScore4 = 0;
            }, function (err) {
                $window.alert(err);
            });
        }

        $scope.getScores = function () {
            getScores();
        }

        $scope.stopGame = function () {
            $rootScope.currentPlayers = null;
        }

        function refreshScores() {
            indexedDBDataSvc.getScores().then(function (data) {
                $scope.scores = data;
                $scope.scoresCollection = [].concat($scope.scores);
                //calculate totals
            }, function (err) {
                $window.alert(err);
            });
        }

    }]);