angular.module('edec').controller('CampaignCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
	
	if ($stateParams.campaign_id != "empty") {
        $scope.campaign_id = $stateParams.campaign_id;
		alert($scope.campaign_id);
	}
	else{
		alert("empty");
	}
}]);
   