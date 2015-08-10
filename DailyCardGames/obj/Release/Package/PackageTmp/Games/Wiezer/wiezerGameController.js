'use strict';

angular.module('Games')

.controller('wiezerGameController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $window, indexedDBDataSvc)
    {
        var score1Inserted, score2Inserted, score3Inserted, score4Inserted;
        var nrOfScoresInserted;
        $scope.canInsertScore = true;
        resetScores();
        
        $scope.player1 = $rootScope.game.players[0];
        $scope.player2 = $rootScope.game.players[1];
        $scope.player3 = $rootScope.game.players[2];
        $scope.player4 = $rootScope.game.players[3];

        $scope.scores = $rootScope.game.scores;

        $scope.checkCanInsertScore = function (nr)
        {
            
            var check = sumScores();
            var input = 0;
            console.log('nr + check ', nr, check);
            if (check == 0) {
                $scope.canInsertScore = true;
            }
            else if (nrOfScoresInserted==4)
            {
                $scope.canInsertScore = false;
                console.log('nr of scores inserterd:', nrOfScoresInserted);
            }
            else
            {
                switch(nr)
                {
                    case 1:
                        if (score1Inserted == false)
                        {
                            nrOfScoresInserted++;
                            score1Inserted = true;
                        }
                        input = $scope.newScore1; break;
                    case 2:
                        if (score2Inserted == false)
                        {
                            nrOfScoresInserted++;
                            score2Inserted = true;
                        }
                        input = $scope.newScore2; break;
                    case 3:
                        if (score3Inserted == false) {
                            nrOfScoresInserted++;
                            score3Inserted = true;
                        }
                        input = $scope.newScore3; break;
                    case 4:
                        if (score4Inserted == false) {
                            nrOfScoresInserted++;
                            score4Inserted = true;
                        }
                        input = $scope.newScore4; break;
                }
                var scoreToGive = 0 - input;
                console.log('input', input);

                if (nrOfScoresInserted == 1)
                {
                    if (scoreToGive % 3 === 0) {
                        scoreToGive = scoreToGive / 3;
                        setScores(scoreToGive);
                    }
                }
                else if (nrOfScoresInserted == 2)
                {
                    scoreToGive = scoreToGive;
                    setScores(scoreToGive);
                }
                else if(nrOfScoresInserted == 3)
                {
                    //if (scoreToGive % 3 === 0) {
                        scoreToGive = scoreToGive * 3;
                        setScores(scoreToGive);
                    //}
                }
                if (sumScores() == 0) { $scope.canInsertScore = true; } else { $scope.canInsertScore = false; }
             /*   $scope.canInsertScore = false;
                $scope.newScore4 = 0 - parseInt($scope.newScore1) - parseInt($scope.newScore2) - parseInt($scope.newScore3);
                $scope.canInsertScore = true;*/
            }
            
        };

        function setScores(scoreToGive)
        {
            console.log('scoreToGive', scoreToGive);
            if (score1Inserted == false) {
                $scope.newScore1 = scoreToGive;
            }
            if (score2Inserted == false) {
                $scope.newScore2 = scoreToGive;
            }
            if (score3Inserted == false) {
                $scope.newScore3 = scoreToGive;
            }
            if (score4Inserted == false) {
                $scope.newScore4 = scoreToGive;
            }
            
        };

        function sumScores()
        {
           return parseInt($scope.newScore1, 10) + parseInt($scope.newScore2, 10) + parseInt($scope.newScore3, 10) + parseInt($scope.newScore4, 10);
        }

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
                //check if there are at least 4 players, else redirect to home
                indexedDBDataSvc.getPlayers().then(function (data) {
                    if (data != null && data.length > 3) 
                    {
                        $state.go('wiezer');
                    }
                    else
                    {
                        $state.go('home');
                    }
                }, function (err) {
                    console.log('Error get players ',err); 
                });
            }, function (err) {
                console.log('Error update game ',err);
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
                resetScores();
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        };

        function resetScores()
        {
            score1Inserted = false;
            score2Inserted = false;
            score3Inserted = false;
            score4Inserted = false;
            $scope.newScore1 = 0;
            $scope.newScore2 = 0;
            $scope.newScore3 = 0;
            $scope.newScore4 = 0;
            nrOfScoresInserted = 0;
        }

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