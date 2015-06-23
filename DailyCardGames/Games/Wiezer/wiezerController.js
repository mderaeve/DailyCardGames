'use strict';

angular.module('Games')

.controller('wiezerController',
    ['$scope', '$rootScope', '$state', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope,$state,  $window, indexedDBDataSvc) {

        $scope.players = [];
        $scope.selectedPlayers = [];
        console.log('wiezer');
        $scope.refreshList = function () {
            indexedDBDataSvc.getPlayers().then(function (data) {
                $scope.players = data;
                console.log('getPlayers');
                ;
            }, function (err) {
                $window.alert(err);
            });
        };

        function init() {
            indexedDBDataSvc.open().then(function () {
                $scope.refreshList();
                console.log('init');
            });
        }

        $scope.selectPlayer = function (player) {
            console.log('push player: ' + player);
            $scope.selectedPlayers.push(player);
            
        };

        $scope.isSelectedPlayer = function (player) {
            if ($scope.selectedPlayers != null)
            {
                console.log('players ' + $scope.selectedPlayers);
                var p;
                for (p in $scope.selectedPlayers)
                {
                    console.log('Check ' + $scope.selectedPlayers[p].id + ' With ' + player.id);
                    
                    if ($scope.selectedPlayers[p].id == player.id)
                    {
                        return true;
                        console.log('Found ' +p.id);
                    }
                }
                console.log('Not found ' + player.id);
                return false;
            }
            else {
                return false;
            }
        }

        init();

    }]);