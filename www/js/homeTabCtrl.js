angular.module('edec').controller('HomeTabCtrl', ['$scope', '$state', '$stateParams', '$ionicPopup', '$timeout', '$rootScope', '$http', '$window','$ionicSideMenuDelegate', 'logat', 'user', function ($scope, $state, $stateParams, $ionicPopup, $timeout, $rootScope, $http, $window,$ionicSideMenuDelegate, logat, user) {

    $scope.showAlert = function (titlu, mesaj) {
        var alertPopup = $ionicPopup.alert({
            title: titlu,
            template: mesaj
        });

        alertPopup.then(function (res) {

        });
    };

    $scope.openMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.activate = function (obj) {

    };

    $scope.showAlert('Stare:' + window.localStorage.getItem('logat'));

    $scope.initializeaza = function () {

        console.log("LocaleStorage Begin:" + window.localStorage.getItem('email'));
        $rootScope.logat=false;
        logat=false;
        var aux = window.localStorage.getItem('logat');
        console.log("Stare:" + aux);
        if (aux && aux.localeCompare("true") === 0) {
            console.log("Sunt logat si initializez");
            $rootScope.user = window.localStorage.getItem('email');
            $rootScope.firstName = window.localStorage.getItem('firstName');
            $rootScope.lastName = window.localStorage.getItem('lastName');
            $rootScope.logat = true;
            $scope.firstname=$rootScope.firstname;
            $scope.lastName=$rootScope.lastName;
            $scope.email=$rootScope.user;
            logat = true;
        }
    };

    $scope.logout = function () {
        $scope.showAlert('Logout', 'I want to leave');
        logat = false;
        window.localStorage.clear();
        $rootScope.logat = false;
        $rootScope.user = "";
        $rootScope.firstName = "";
        $rootScope.lastName = "";
        $state.go('tabs.home');
    };


    $scope.moveToCampainPage=function(nume)
    {
      $scope.showAlert('Campanie','Vizualizare '+nume);
    };

    $scope.moveToProfilePage=function(user)
    {
        $state.go('tabs.profile',{'user':user});
        $ionicSideMenuDelegate.toggleLeft();

    };


}]);
