﻿'use strict';

angular.module('Home')

.factory('indexedDBDataSvc', function ($window, $q) {
    var indexedDB = $window.indexedDB;
    var db = null;
    var lastPlayerIndex = 0;
    var lastScoreIndex = 0;

    var open = function () {
        var deferred = $q.defer();
        var version = 1;
        var request = indexedDB.open("dailygamesData", version);

        request.onupgradeneeded = function (e) {
            db = e.target.result;

            e.target.transaction.onerror = indexedDB.onerror;

            if (db.objectStoreNames.contains("players")) {
                db.deleteObjectStore("players");
            }

            var store = db.createObjectStore("players", {
                keyPath: "id"
            });

            if (db.objectStoreNames.contains("scores")) {
                db.deleteObjectStore("scores");
            }

            var store = db.createObjectStore("scores", {
                keyPath: "id"
            });
        };

        request.onsuccess = function (e) {
            db = e.target.result;
            deferred.resolve();
        };

        request.onerror = function () {
            deferred.reject();
        };

        return deferred.promise;
    };

    var getPlayers = function () {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["players"], "readwrite");
            var store = trans.objectStore("players");
            var players = [];

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.resolve(players);
                } else {
                    players.push(result.value);
                    if (result.value.id > lastPlayerIndex) {
                        lastPlayerIndex = result.value.id;
                    }
                    result.continue();
                }
            };

            cursorRequest.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };

    var deletePlayer = function (id) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["players"], "readwrite");
            var store = trans.objectStore("players");

            var request = store.delete(id);

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("players item couldn't be deleted");
            };
        }

        return deferred.promise;
    };

    var addPlayer = function (playerText) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["players"], "readwrite");
            var store = trans.objectStore("players");
            lastPlayerIndex++;
            var request = store.put({
                "id": lastPlayerIndex,
                "text": playerText
            });

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("player item couldn't be added!");
            };
        }
        return deferred.promise;
    };

    var getScores = function () {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["scores"], "readwrite");
            var store = trans.objectStore("scores");
            var scores = [];

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.resolve(scores);
                } else {
                    scores.push(result.value);
                    if (result.value.id > lastScoreIndex) {
                        lastScoreIndex = result.value.id;
                    }
                    result.continue();
                }
            };

            cursorRequest.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };

    var addScore = function (score) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["scores"], "readwrite");
            var store = trans.objectStore("scores");
            lastScoreIndex++;
            var request = store.put({
                "id": lastScoreIndex,
                "score": score
            });

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("score item couldn't be added!");
            };
        }
        return deferred.promise;
    };

    return {
        open: open,
        getPlayers: getPlayers,
        addPlayer: addPlayer,
        deletePlayer: deletePlayer,
        getScores: getScores,
        addScore: addScore
    };

});