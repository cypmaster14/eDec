angular.module('edec').controller('profile',['$scope','$state','$stateParams','$http','$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {

  $scope.getMyPageInfo=function()
  {
    var email=$rootScope.user;

    var requestForCampaign=$http.get('https://nodeserve-cypmaster14.c9users.io/myCampaign?user='+email);
    requestForCampaign.success(function(data,status,headers,config){
        if(status==200)
        {
          $rootScope.campanii=data.listaCampanii;
          $rootScope.areCampanii=true;
        }
    });

    requestForCampaign.error(function(data,status,headers,config){

        if(status==409)
        {
          $rootScope.areCampanii=false;
        }
    });

    var requestForPreferences=$http.get('https://nodeserve-cypmaster14.c9users.io/getUserPreferences?email='+email);
    requestForPreferences.success(function(data,status,headers,config){
          if(status==200)
          {
            $rootScope.preferinteLike=data.like;
            $rootScope.preferinteDislike=data.dislike;
            $rootScope.preferinteAlert=data.alert;
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
      }
    });
  };

  $rootScope.goToCampaign=function(campaign)
  {
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


  $rootScope.modify=function(produs){
    $scope.showConfirm(produs);
  };

  $scope.showConfirm=function(produs){
      var confirmPopup=$ionicPopup.confirm({
        title:'Modifica preferinta',
        template:'Doriti sa stergeti '+produs
      });

      confirmPopup.then(function(res) {
         if(res) {
           var obj={
                      email:$rootScope.user,
                      ingredient:produs
                    };

            var requestForRemovePreference=$http.post('https://nodeserve-cypmaster14.c9users.io/removePreference',obj);
            requestForRemovePreference.success(function(data,status,headers,config){
                  if(status==200)
                  {
                    var email=$rootScope.user;
                    var requestForPreferences=$http.get('https://nodeserve-cypmaster14.c9users.io/getUserPreferences?email='+email);
                    requestForPreferences.success(function(data,status,headers,config){
                          if(status==200)
                          {
                            $rootScope.preferinteLike=data.like;
                            $rootScope.preferinteDislike=data.dislike;
                            $rootScope.preferinteAlert=data.alert;
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
                      }
                    });

                  }
            });

            requestForRemovePreference.error(function(data,status,headers,config){
                  if(status==409)
                  {
                    $scope.showAlert('Eroare','A aparut o eroare la stergerea produsului');
                  }
            });

         }
       });


    };





}]);
