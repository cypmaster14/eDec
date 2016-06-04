angular.module('edec').controller('CampaniiCtrl',['$scope','$state','$stateParams','$http','$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
	$scope.campanii=$rootScope.campanii;
	$scope.clickOnCampaign = function (campaign) {
            $state.go("tabs.campaign", {
                campaign_name: campaign.nume, campaign_id: campaign.id, campaign_description: campaign.descriere,
                imagine: campaign.poza, creation_date: campaign.data, administrator: $rootScope.user
            });
    };
}]);
