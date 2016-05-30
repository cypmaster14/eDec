angular.module('edec').controller('CampaignCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
	
	if ($stateParams.obj!= null) {
        $scope.campaign_id = $stateParams.obj.campaign_id;
		$scope.campaign_description=$stateParams.obj.description;
		$scope.campaign_image=$stateParams.obj.imagine;
	}
	else{
		alert("empty");
	}
}]);
   