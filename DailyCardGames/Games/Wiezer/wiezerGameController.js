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
        if ($rootScope.game != null) {
            $scope.player1 = $rootScope.game.players[0];
            $scope.player2 = $rootScope.game.players[1];
            $scope.player3 = $rootScope.game.players[2];
            $scope.player4 = $rootScope.game.players[3];
            $scope.scores = $rootScope.game.scores;
            refreshScores();
        }
        

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

        $scope.error = function ()
        {
            $scope.newScore1 = 1;
            $scope.newScore2 = 1;
            $scope.newScore3 = 1;
            $scope.newScore4 = 1;
            if ($scope.player1.turn == $rootScope.selectedPlayerColor) {
                $scope.newScore1 = -3;
            } else if ($scope.player2.turn == $rootScope.selectedPlayerColor) {
                $scope.newScore2 = -3;
            } else if ($scope.player3.turn == $rootScope.selectedPlayerColor) {
                $scope.newScore3 = -3;
            } else {
                $scope.newScore4 = -3;
            }
            insertScore();
        }

        $scope.insertScore = function ()
        {
            insertScoreInDB();
        };

        $scope.rules = function () {
            $state.go('wiezerrules');
        };

        $scope.stopGame = function () {
            $rootScope.game.active = 0;
            $rootScope.game.players[0].won = false;
            $rootScope.game.players[1].won = false;
            $rootScope.game.players[2].won = false;
            $rootScope.game.players[3].won = false;
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
            insertScore();
            
        };

        function insertScore() {
            var score = [$scope.newScore1, $scope.newScore2, $scope.newScore3, $scope.newScore4];

            $scope.scores.push(score);

            $rootScope.game.players[0] = $scope.player1;
            $rootScope.game.players[1] = $scope.player2;
            $rootScope.game.players[2] = $scope.player3;
            $rootScope.game.players[3] = $scope.player4;

            $rootScope.game.scores = $scope.scores;
            indexedDBDataSvc.updateGame($rootScope.game).then(function () {
                refreshScores();
                resetScores();
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        };

        function checkScore (player) {
            var win = (player.total > $rootScope.game.maxScore - 1);
            if (win == true) {
                player.wins++;
                indexedDBDataSvc.updatePlayer(player).then(function () {
                }, function (err) {
                    console.log(err); //$window.alert(err);
                });
                ShowPlayerWon(player);
            }
            else
            {
                player.won = false;
            }
            return win;
        }

        function ShowPlayerWon(player) {
            //player.turn = "#FFD700";
            player.won = true;
        }

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

        function refreshScores()
        {
                
            //calculate totals
            $scope.player1.total = 0;
            $scope.player2.total = 0;
            $scope.player3.total = 0;
            $scope.player4.total = 0;
            var i = 1;

            $scope.scores.forEach(function (score)
            {
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
            checkScore($scope.player1);
            checkScore($scope.player2);
            checkScore($scope.player3);
            checkScore($scope.player4);
        };

        //This will sort your array
        function SortById(a, b) {
            var scoreA = a.counter;
            var scoreB = b.counter;
            return ((scoreA > scoreB) ? -1 : ((scoreA < scoreB) ? 1 : 0));
        };

    }]);