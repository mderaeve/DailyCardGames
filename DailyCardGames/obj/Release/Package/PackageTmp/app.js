
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
        templateUrl: '/Games/Wiezer/wiezerHomeView.html',
        controller: 'wiezerHomeController'
    })

    .state('wiezergame', {
        url: '/wiezer/game',
        templateUrl: '/Games/Wiezer/wiezerGameView.html',
        controller: 'wiezerGameController'
    })

    .state('wiezerrules', {
        url: '/wiezer/rules',
        templateUrl: '/Games/Wiezer/wiezerRulesView.html',
    })

    .state('kinger', {
        url: '/kinger',
        templateUrl: '/Games/Kinger/kingerHomeView.html',
        controller: 'kingerHomeController'
    })

     .state('kingergame', {
         url: '/kinger/game',
         templateUrl: '/Games/Kinger/kingerGameView.html',
         controller: 'kingerGameController'
     })

    .state('kingerrules', {
        url: '/kinger/rules',
        templateUrl: '/Games/Kinger/kingerRulesView.html',
    })

});

app.run(['$rootScope', '$location', '$http', '$state',
    function ($rootScope, $location, $http, $state) {

        //// keep user logged in after page refresh
        //$rootScope.globals = $cookieStore.get('globals') || {};
        //if ($rootScope.globals.currentUser) {
        //    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line

        //}
        //else {
        //    // redirect to login page if not logged in
        //    if ($location.path() !== 'login' && !$rootScope.globals.currentUser) {
        //        $location.path('login');
        //    }
        //}


        //$rootScope.$on('$locationChangeStart', function (event, next, current) {
        //    // redirect to login page if not logged in
        //    if ($location.path() !== 'login' && !$rootScope.globals.currentUser) {
        //        $state.go('login');
        //    }
        //});

        //Keep the previous state.
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            $state.previous = fromState;
        });
    }]);