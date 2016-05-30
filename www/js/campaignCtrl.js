angular.module('edec').controller('CampaignCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
	$scope.getNumberOfMembersFor=function(campaign){	
		var membersResponse = $http.post('https://nodeserve-cypmaster14.c9users.io/getNumberOfMembersFor',campaign);
		
		membersResponse.success(function(data,status,headers,config){
			if (status == 200){
				$scope.campaign_nrUsers=data.nrUsers;
			}
		});
		
		membersResponse.error(function (data, status, headers, config) {
            alert("Error on request la obtinerea numarului de membri" + status + ' ' + headers);

        });
	}
	if ($stateParams.obj!= null) {
		$scope.campaign_name=$stateParams.obj.campaign_name;
        $scope.campaign_id = $stateParams.obj.campaign_id;
		$scope.campaign_description=$stateParams.obj.description;
		$scope.campaign_image=$stateParams.obj.imagine;
		$scope.getNumberOfMembersFor($stateParams.obj);
	}
	else{
		alert("empty");
	}
}]);
   