'use strict';

angular.module('Home')

.controller('homeController',
    ['$scope', '$rootScope', '$state', '$stateParams','$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $state, $stateParams, $window, indexedDBDataSvc) {

        $scope.players = [];
 
        $scope.refreshList = function () {
            indexedDBDataSvc.getPlayers().then(function (data) {
                $scope.players = data;
;            }, function (err) {
    console.log(err);// $window.alert(err);
            });
        };

        $scope.addPlayer = function ()
        {
            indexedDBDataSvc.addPlayer($scope.playerText).then(function () {
                $scope.refreshList();
                $scope.playerText = "";
            }, function (err) {
                console.log(err);// $window.alert(err);
            });
        };

        $scope.deletePlayer = function (id) {
            indexedDBDataSvc.deletePlayer(id).then(function () {
                $scope.refreshList();
            }, function (err) {
                console.log(err); //$window.alert(err);
            });
        };

        function init() {
            indexedDBDataSvc.open().then(function () {
                $scope.refreshList();
                console.log('init');
            });
        }

        init();

    }]);


