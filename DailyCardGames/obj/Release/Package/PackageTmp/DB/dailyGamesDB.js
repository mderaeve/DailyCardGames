'use strict';

angular.module('Home')

.factory('indexedDBDataSvc', function ($window, $q) {
    var indexedDB = $window.indexedDB;
    var db = null;
    var lastPlayerIndex = 0;
    var lastScoreIndex = 0;
    var lastGameIndex = 0;

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

            if (db.objectStoreNames.contains("games")) {
                db.deleteObjectStore("games");
            }

            var store = db.createObjectStore("games", {
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

    var updatePlayer = function (player) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["players"], "readwrite");
            var store = trans.objectStore("players");
            player.number = 0;
            var request = store.put(player);

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
                "text": playerText,
                "number": 0,
                "wins": 0
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

    var getActiveGame = function (gameType) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["games"], "readwrite");
            var store = trans.objectStore("games");

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.resolve(null);
                } else {
                    //Return active game
                    if (result.value.active == 1 && result.value.gameType == gameType) {

                        deferred.resolve(result.value);
                    }
                    if (result.value.id > lastGameIndex) {
                        lastGameIndex = result.value.id;
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

    var addGame = function (players, gameType, subType, maxScore) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["games"], "readwrite");
            var store = trans.objectStore("games");
            lastGameIndex++;
            var request = store.put({
                "id": lastGameIndex,
                "active": 1,
                "players": players,
                "gameType": gameType,
                "subType": subType,
                "scores": [],
                "maxScore": maxScore
            });

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Game item couldn't be added!");
            };
        }
        return deferred.promise;
    };

    var updateGame = function (game) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["games"], "readwrite");
            var store = trans.objectStore("games");
            lastGameIndex++;
            var request = store.put(game);

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Game item couldn't be updated!");
            };
        }
        return deferred.promise;
    };

    return {
        open: open,
        getPlayers: getPlayers,
        addPlayer: addPlayer,
        updatePlayer: updatePlayer,
        deletePlayer: deletePlayer,
        getActiveGame: getActiveGame,
        addGame: addGame,
        updateGame: updateGame
    };

});