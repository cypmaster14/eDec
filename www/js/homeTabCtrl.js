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
	
	if ($rootScope.lastSearchedProduct == null){
		$rootScope.lastSearchedProduct='';
	}

    $scope.initializeaza = function () {
        console.log("LocaleStorage Begin:" + window.localStorage.getItem('email'));
        $rootScope.logat=false;
        logat=false;
        var aux = window.localStorage.getItem('logat');
        if (aux && aux.localeCompare("true") === 0) {
            console.log("Sunt logat si initializez");
            //aici voi face requestul pentru campaniile si activitatile userilor filtrate 
            $rootScope.user = window.localStorage.getItem('email');
            $rootScope.firstName = window.localStorage.getItem('firstName');
            $rootScope.lastName = window.localStorage.getItem('lastName');
            $rootScope.reputation=window.localStorage.getItem('reputation');
            $rootScope.logat = true;
            $scope.firstname=$rootScope.firstname;
            $scope.lastName=$rootScope.lastName;
            $scope.email=$rootScope.user;
            logat = true;
        }
        else{
        }
        var email=$rootScope.user;
            console.log("Vreau sa aflu campaniile pt:"+email);
            var requestForCampaign=$http.get('https://nodeserve-cypmaster14.c9users.io/trimiteCampanii?user='+email);
            requestForCampaign.success(function(data,status,headers,config){
            if(status==200){
                $rootScope.campanii=data.listaCampanii;
                $scope.campanii=data.listaCampanii;
                $rootScope.areCampanii=true;
                console.log("campanii:"+JSON.stringify($scope.campanii));
            }
            });
            requestForCampaign.error(function(data,status,headers,config){
                 if(status==409){
                     $rootScope.areCampanii=false;
                     console.log("Nu am campanii");
                }
            });
    };

    $scope.logout = function () {
        logat = false;
        window.localStorage.clear();
        //aici voi face requestul pentru a lua campaniile si activitatile userilor cele mai recente
        $rootScope.logat = false;
        $rootScope.user = "";
        $rootScope.firstName = "";
        $rootScope.lastName = "";
        $state.go('tabs.home');
        $scope.initializeaza();
    };


    $scope.moveToCampainPage=function(nume)
    {
    };

    $scope.moveToProfilePage=function(user)
    {
        $state.go('tabs.profile',{'user':user});
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.goToCampaigns=function(){
        $state.go('tabs.campanii');
    };
	
    $scope.goToUsersActivities=function(){
        $state.go('tabs.activitatiUseri');
    };

	$scope.goToUserPage=function(user){
		$state.go('tabs.profile',{'user':user});
	}

    $scope.clickOnCampaign = function (campaign) {
		$state.go("tabs.campaign", {
			campaign_name: campaign.nume, campaign_id: campaign.id, campaign_description: campaign.descriere,
			imagine: campaign.poza, creation_date: campaign.data, administrator: $rootScope.user
		});
    };

}]);
