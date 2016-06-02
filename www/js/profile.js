angular.module('edec').controller('profile',['$scope','$state','$stateParams','$http','$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {

  $scope.getMyPageInfo=function()
  {
    var email=$rootScope.user;
    console.log("Vreau sa aflu campaniile pt:"+email);

    var requestForCampaign=$http.get('https://nodeserve-cypmaster14.c9users.io/myCampaign?user='+email);
    requestForCampaign.success(function(data,status,headers,config){
        if(status==200)
        {
          $rootScope.campanii=data.listaCampanii;
          $rootScope.areCampanii=true;
          console.log("campanii:"+JSON.stringify($scope.campanii));
        }
    });

    requestForCampaign.error(function(data,status,headers,config){

        if(status==409)
        {
          $rootScope.campanii=
          $rootScope.areCampanii=false;
          console.log("Nu am campanii");
        }
    });


    console.log("Vreau sa aflu preferintele lui:"+email);

    var requestForPreferences=$http.get('https://nodeserve-cypmaster14.c9users.io/getUserPreferences?email='+email);
    requestForPreferences.success(function(data,status,headers,config){
          if(status==200)
          {
            $rootScope.preferinteLike=data.like;
            $rootScope.preferinteDislike=data.dislike;
            $rootScope.preferinteAlert=data.alert;
            console.log("Like:"+JSON.stringify($rootScope.preferinteLike));
            console.log("Dislike:"+JSON.stringify($rootScope.preferinteDislike));
            console.log("Alert:"+JSON.stringify($rootScope.preferinteAlert));
            $rootScope.arePreferinte=true;

          }
    });

    requestForPreferences.error(function(data,status,headers,config){
      if(status==409)
      {
        $rootScope.preferinteLike=null;
        $rootScope.preferinteDislike=null;
        $rootScope.preferinteAlert=null;
        $rootScope.arePreferinte=false;
        console.log("Nu am preferinte");
      }
    });




  };

  $rootScope.goToCampaign=function(campaign)
  {
    // $scope.showAlert("Campanie","Vreau sa merg la campania:"+campanie.id);
    $state.go("tabs.campaign",
                {
                  campaign_name:campaign.nume,
                  campaign_id:campaign.id,
                  campaign_description:campaign.descriere,
                  imagine:campaign.poza,
                  creation_date:campaign.data,
                  administrator:campaign.administrator
                }
    );

  };

}]);
