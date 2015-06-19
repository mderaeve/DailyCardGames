'use strict';

angular.module('Home')

.controller('homeController',
    ['$scope', '$rootScope', '$state', '$stateParams',
    function ($scope, $rootScope, $state, $stateParams) {

        const playerData = [
        { playerID: 1, name: "Mark"},
        { playerID: 2, name: "Priscilla"}
        ];

        const dbName = "MyDailyCardGamesInfo";

        var request = indexedDB.open(dbName, 2);

        request.onerror = function (event) {
            // Handle errors.
        };
        request.onupgradeneeded = function (event) {
            var db = event.target.result;

            // Create an objectStore to hold information about our customers. We're
            // going to use "ssn" as our key path because it's guaranteed to be
            // unique - or at least that's what I was told during the kickoff meeting.
            var objectStore = db.createObjectStore("players", { keyPath: "playerID" });

            // Create an index to search customers by name. We may have duplicates
            // so we can't use a unique index.
            objectStore.createIndex("name", "name", { unique: false });

            // Use transaction oncomplete to make sure the objectStore creation is 
            // finished before adding data into it.
            objectStore.transaction.oncomplete = function (event) {
                // Store values in the newly created objectStore.
                var customerObjectStore = db.transaction("players", "readwrite").objectStore("players");
                for (var i in playerData) {
                    customerObjectStore.add(playerData[i]);
                }
            }
        };


    }]);