angular.module('edec').controller("CreateCampaignCtrl", ['$scope','$state','$rootScope','logat','user','$ionicActionSheet', '$http', '$window', '$ionicPopup', '$timeout', function ($scope,$state,$rootScope,logat,user,$ionicActionSheet, $http, $window, $ionicPopup, $timeout) {
    $scope.showAlert = function (titlu, mesaj) {
        var alertPopup = $ionicPopup.alert({
            title: titlu,
            template: mesaj
        });

        alertPopup.then(function (res) {

        });
    };

    $scope.register = function () {
         if (!$rootScope.logat || $rootScope.logat == false) {
        $scope.showAlert('LogIn', 'Trebuie sa fiti logat!');
        return;
       }	
        if (!$scope.numeCampanie || !$scope.descriereCampanie || !$scope.pozaCampanie) {

            $scope.showAlert('Try Again', "All field must be completed");
            return;
        }
        var pozaCampanie = $scope.pozaCampanie;
        var numeCampanie = $scope.numeCampanie;
        var descriereCampanie = $scope.descriereCampanie;

        var obj = {
            pozaCampanie: pozaCampanie,
            numeCampanie: numeCampanie,
            descriereCampanie: descriereCampanie
        };

        console.log(obj);

        /*var res = $http.post('https://nodeserve-cypmaster14.c9users.io/register', obj);
        res.success(function (data, status, headers, config) {
            if (status == 200) {
                $scope.mesaj = data;
                console.log("Text:" + $scope.mesaj.text);

                if ($scope.mesaj.text.localeCompare('Account created') == 0) {
                    $scope.showAlert('Register', 'Succes');
                    $window.location.href = "/#/tab/facts";
                }

                else {
                    $scope.showAlert('Registration failed', $scope.mesaj.text);
                }
            }
        });

        res.error(function (data, status, headers, config) {
            alert("Error on request" + status + ' ' + headers);

        });
		*/

    };

}]);