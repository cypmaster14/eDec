angular.module('edec').controller("CreateCampaignCtrl", ['$scope','$stateParams','$state','$rootScope','logat','user','$ionicActionSheet', '$http', '$window', '$ionicPopup', '$timeout', function ($scope,$stateParams,$state,$rootScope,logat,user,$ionicActionSheet, $http, $window, $ionicPopup, $timeout) {
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
		var barcode=$stateParams.barcode;
        var pozaCampanie = $scope.pozaCampanie;
        var numeCampanie = $scope.numeCampanie;
        var descriereCampanie = $scope.descriereCampanie;
        var administrator=$rootScope.user;
        var obj = {
            pozaCampanie: pozaCampanie,
            numeCampanie: numeCampanie,
            descriereCampanie: descriereCampanie,
			administrator: administrator,
			barcode: $stateParams.barcode
        };

        console.log(obj);

        var res = $http.post('https://nodeserve-cypmaster14.c9users.io/creareCampanie', obj);
        res.success(function (data, status, headers, config) {
            if (status == 200) {
				$scope.showAlert("Campanie creata cu succes!");                  
                    $window.location.href = "/#/tab/product";   
            }
        });

        res.error(function (data, status, headers, config) {
            alert("Error on request" + status + ' ' + headers);

        });
		

    };

}]);