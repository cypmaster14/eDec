﻿angular.module('edec').controller("logIn", ['$scope', '$state', '$stateParams', '$http', '$window', '$ionicPopup', '$timeout', '$rootScope', 'logat', 'user', function ($scope, $state, $stateParams, $http, $window, $ionicPopup, $timeout, $rootScope, logat, user) {

    $scope.showAlert = function (titlu, mesaj) {
        var alertPopup = $ionicPopup.alert({
            title: titlu,
            template: mesaj
        });

        alertPopup.then(function (res) {
            console.log("You clicked Ok");
        });
    };

    $scope.login = function () {

        if (!$scope.email || !$scope.password) {
            $scope.showAlert("Try Again", "All fields must be completted");
            return;
        }

        var email = $scope.email;
        var password = $scope.password;

        var obj = {
            email: email,
            password: password
        };

        console.log(obj);

        var res = $http.post('https://nodeserve-cypmaster14.c9users.io/login', obj);

        res.success(function (data, status, headers, config) {
            if (status == 200) //succes
            {
                $scope.mesaj = data;

                if ($scope.mesaj.text.localeCompare('Login Succes') == 0) {
                    logat = true;
                    $rootScope.logat = true;
                    $rootScope.user = obj.email;
                    console.log("Nume:" + data.firstName);
                    $rootScope.firstName = data.firstName;
                    $rootScope.lastName = data.lastName;
                    $scope.showAlert('Login', 'Loged as ' + $rootScope.user + "(Log=" + $rootScope.logat + ")" + $rootScope.firstName + " " + $rootScope.lastName);
                    $state.go("tabs.home");
                    window.localStorage.setItem("email", $rootScope.user);
                    window.localStorage.setItem("firstName", $rootScope.firstName);
                    window.localStorage.setItem("lastName", $rootScope.lastName);
                    window.localStorage.setItem("logat", $rootScope.logat);
                    console.log("LocaleStorage:" + window.localStorage.getItem('email'));
                }
                else {
                    $scope.showAlert('Login failed', $scope.mesaj.text);
                }
            }
        });

        res.error(function (data, status, headers, config) {
            alert("Error on request" + status + ' ' + headers);
        });

    };

}]);