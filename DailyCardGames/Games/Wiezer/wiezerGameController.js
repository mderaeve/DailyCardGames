'use strict';

angular.module('Games')

.controller('wiezerGameController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc)
    {

        $scope.canInsertScore = true;
        $scope.newScore1 = 0;
        $scope.newScore2 = 0;
        $scope.newScore3 = 0;
        $scope.newScore4 = 0;
        
        $scope.player1 = $rootScope.game.players[0];
        $scope.player2 = $rootScope.game.players[1];
        $scope.player3 = $rootScope.game.players[2];
        $scope.player4 = $rootScope.game.players[3];

        $scope.scores = $rootScope.game.scores;

        $scope.checkCanInsertScore = function () {
            var check = parseInt($scope.newScore1, 10) + parseInt($scope.newScore2, 10) + parseInt($scope.newScore3, 10) + parseInt($scope.newScore4, 10);
            if (check == 0) {
                $scope.canInsertScore = true;
            }
            else {
                $scope.canInsertScore = false;
                $scope.newScore4 = 0 - parseInt($scope.newScore1) - parseInt($scope.newScore2) - parseInt($scope.newScore3);
                $scope.canInsertScore = true;
            }
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

        $scope.pass = function () {
            $scope.newScore1 = 0;
            $scope.newScore2 = 0;
            $scope.newScore3 = 0;
            $scope.newScore4 = 0;
            insertScoreInDB();
        };

        $scope.insertScore = function ()
        {
            insertScoreInDB();
        };

        $scope.rules = function () {
            $state.go('wiezerrules');
        };

        $scope.stopGame = function () {
            $rootScope.game.active = 0;
            indexedDBDataSvc.updateGame($rootScope.game).then(function (data) {
                $rootScope.game = null;
                $state.go('wiezer');
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        };

        function insertScoreInDB()
        {
            if ($scope.newScore1 > 0 || $scope.newScore2 > 0 || $scope.newScore3 > 0 || $scope.newScore4 > 0) {
                changeTurn();
            }

            var score = [$scope.newScore1, $scope.newScore2, $scope.newScore3, $scope.newScore4];

            $scope.scores.push(score);

            $rootScope.game.players[0] = $scope.player1;
            $rootScope.game.players[1] = $scope.player2;
            $rootScope.game.players[2] = $scope.player3;
            $rootScope.game.players[3] = $scope.player4;

            $rootScope.game.scores = $scope.scores;
            indexedDBDataSvc.updateGame($rootScope.game).then(function ()
            {
                refreshScores();
                $scope.newScore1 = 0;
                $scope.newScore2 = 0;
                $scope.newScore3 = 0;
                $scope.newScore4 = 0;
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        };

        function changeTurn()
        {
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

        function refreshScores()
        {
                
                //calculate totals
                $scope.player1.total = 0;
                $scope.player2.total = 0;
                $scope.player3.total = 0;
                $scope.player4.total = 0;
                var i = 1;
                
                

                $scope.scores.forEach(function (score) {
                    console.log(score);
                    if (score.counter ==  null || score.counter == 0)
                    {
                        score.counter = i;
                        i++;
                    }
                    else
                    {
                        if (i <= score.counter) i = score.counter +1;
                    }
                   
                    $scope.player1.total += parseInt(score[0]);
                    $scope.player2.total += parseInt(score[1]);
                    $scope.player3.total += parseInt(score[2]);
                    $scope.player4.total += parseInt(score[3]);
                });

                if ($scope.scores != null) {
                    $scope.scores = $scope.scores.sort(SortById);
                }
            
        };



        //This will sort your array
        function SortById(a, b) {
            var scoreA = a.counter;
            var scoreB = b.counter;
            return ((scoreA > scoreB) ? -1 : ((scoreA < scoreB) ? 1 : 0));
        };

        refreshScores();

    }]);