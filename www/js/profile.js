angular.module('edec').controller('profile',['$scope','$state','$stateParams','$http','$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {

  $scope.getMyPageInfo=function()
  {
    var email=$rootScope.user;
    console.log("Reputatie:"+$rootScope.reputation);
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

    console.log("Modific:"+produs);
    $scope.showConfirm(produs);

  };





  $scope.showConfirm=function(produs){
      var confirmPopup=$ionicPopup.confirm({
        title:'Modifica preferinta',
        template:'Doriti sa stergeti '+produs
      });

      confirmPopup.then(function(res) {
         if(res) {
           console.log('Sterg:'+produs +"email:"+$rootScope.user);
           var obj={
                      email:$rootScope.user,
                      ingredient:produs
                    };
            console.log("Trimit server-ului:"+JSON.stringify(obj));

            var requestForRemovePreference=$http.post('https://nodeserve-cypmaster14.c9users.io/removePreference',obj);
            requestForRemovePreference.success(function(data,status,headers,config){
                  if(status==200)
                  {
                    console.log('Am sterg produsul');
                    var email=$rootScope.user;
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

                  }
            });

            requestForRemovePreference.error(function(data,status,headers,config){
                  if(status==409)
                  {
                    $scope.showAlert('Eroare','A aparut o eroare la stergerea produsului');
                  }
            });

         }
         else
         {
           console.log('Nu mai sterg:'+produs);
         }
       });


    };





}]);
