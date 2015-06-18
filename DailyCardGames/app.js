
// declare modules
angular.module('Home', []);

var routerApp = angular.module('routerApp', ['ui.router', 'Home']);

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

     .state('home', {
         url: '/home',
         templateUrl: '/Home/homeView.html',
         controller: 'homeController'
     })

    .state('wiezer', {
        url: '/wiezer',
        templateUrl: '/Games/Wiezer/wiezerView.html'
    })

    .state('kinger', {
        url: '/kinger',
        templateUrl: '/Games/Kinger/kingerView.html'
    })

});