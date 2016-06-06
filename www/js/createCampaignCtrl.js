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
                   // $window.location.href = "/#/tab/product";   
                var resCampaignId = $http.get('https://nodeserve-cypmaster14.c9users.io/trimiteCampanie?numeCampanie='+numeCampanie+'&descriereCampanie='+descriereCampanie
                +'&pozaCampanie='+pozaCampanie +'&administrator='+administrator+'&barcode='+barcode); 
                resCampaignId.success(function (data, status, headers, config) {
                    if (status == 200) {
                        $scope.idCampanie = data.campaign_id;
                        $scope.creation_date=data.creation_date;
                        console.log("id======="+$scope.idCampanie);
                        var aAderat = $http.get('https://nodeserve-cypmaster14.c9users.io/aderareCampanie?campaignId=' + $scope.idCampanie + '&administrator=' + administrator);
                        aAderat.success(function (data, status, headers, config) {
                            if (status == 200) {
                                $state.go("tabs.campaign", {campaign_name: numeCampanie, campaign_id: $scope.idCampanie,campaign_description: descriereCampanie,
                                imagine: pozaCampanie, creation_date: $scope.creation_date, administrator: administrator, product_barcode: obj.barcode, product_name: $stateParams.name});
                            }          
                        });   
                    }   
                });
            }
        });
        res.error(function (data, status, headers, config) {
            alert("Error on request" + status + ' ' + headers);

        });
		

    };

}]);