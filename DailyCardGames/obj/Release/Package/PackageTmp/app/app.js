/// <reference path="_app.ts" />
// declare modules
angular.module('Home', []);
angular.module('Games', []);
var app = angular.module('dailycardApp', ['ui.router', 'Home', 'Games']);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    //var virtualDir = '/DailyCardGames';
    var virtualDir = '';
    $stateProvider
        .state('home', {
        url: '/home',
        templateUrl: virtualDir + '/Home/homeView.html',
        controller: 'homeController'
    })
        .state('wiezer', {
        url: '/wiezer',
        templateUrl: virtualDir + '/Games/Wiezer/wiezerHomeView.html',
        controller: 'wiezerHomeController'
    })
        .state('wiezergame', {
        url: '/wiezer/game',
        templateUrl: virtualDir + '/Games/Wiezer/wiezerGameView.html',
        controller: 'wiezerGameController'
    })
        .state('wiezerrules', {
        url: '/wiezer/rules',
        templateUrl: virtualDir + '/Games/Wiezer/wiezerRulesView.html',
    })
        .state('kinger', {
        url: '/kinger',
        templateUrl: virtualDir + '/Games/Kinger/kingerHomeView.html',
        controller: 'kingerHomeController'
    })
        .state('kingergame', {
        url: '/kinger/game',
        templateUrl: virtualDir + '/Games/Kinger/kingerGameView.html',
        controller: 'kingerGameController'
    })
        .state('kingerrules', {
        url: '/kinger/rules',
        templateUrl: virtualDir + '/Games/Kinger/kingerRulesView.html',
    });
});
app.run(['$rootScope', '$location', '$http', '$state', 'indexedDBDataSvc',
    function ($rootScope, $location, $http, $state, indexedDBDataSvc) {
        $rootScope.selectedPlayerColor = "#5CB85C";
        //Keep the previous state.
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            $state.previous = fromState;
        });
    }]);
//# sourceMappingURL=app.js.map