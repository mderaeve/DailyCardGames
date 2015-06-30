'use strict';

angular.module('Games')

.controller('kingerHomeController',
    ['$scope', '$rootScope', '$window', 'indexedDBDataSvc',
    function ($scope, $rootScope, $window, indexedDBDataSvc) {

        $scope.players = [];

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

        init();

    }]);