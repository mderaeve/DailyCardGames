
// declare modules
angular.module('Home', []);
angular.module('Games', []);

var app = angular.module('dailycardApp', ['ui.router', 'Home','Games']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

     .state('home', {
         url: '/home',
         templateUrl: '/Home/homeView.html',
         controller: 'homeController'
     })

    .state('wiezer', {
        url: '/wiezer',
        templateUrl: '/Games/Wiezer/wiezerView.html',
        controller: 'wiezerController'
    })

    .state('kinger', {
        url: '/kinger',
        templateUrl: '/Games/Kinger/kingerView.html',
        controller: 'kingerController'
    })

});

