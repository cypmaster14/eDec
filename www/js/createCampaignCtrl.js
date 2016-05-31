angular.module('edec').controller("CreateCampaignCtrl", ['$scope', '$http', '$window', '$ionicPopup', '$timeout', function ($scope, $http, $window, $ionicPopup, $timeout) {

    $scope.showAlert = function (titlu, mesaj) {
        var alertPopup = $ionicPopup.alert({
            title: titlu,
            template: mesaj
        });

        alertPopup.then(function (res) {

        });
    };

    $scope.register = function () {

        if (!$scope.numeCampanie || !$scope.descriereCampanie || !$scope.pozaCampanie) {

            $scope.showAlert('Try Again', "All field must be completed");
            return;
        }
        var pozaCampanie = $scope.pozaCampanie;
        var numeCampanie = $scope.numeCampanie;
        var pozaCampanie = $scope.pozaCampanie;

        var obj = {
            pozaCampanie: pozaCampanie,
            numeCampanie: numeCampanie,
            pozaCampanie: pozaCampanie
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