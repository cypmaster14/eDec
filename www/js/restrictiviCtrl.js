angular.module('edec').controller('RestrictiviCtrl',['$scope','$state','$stateParams','$http','$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user){

  $scope.getMostRestrictiveUsers=function(){

    console.log("Vreau sa iau cei mai slifositi useri");
    var requestForMostRestrictiveUsers=$http.get('https://nodeserve-cypmaster14.c9users.io/mostRestrictive');

    requestForMostRestrictiveUsers.success(function(data,status,headers,config){
      if(status==200)
      {
        $scope.topUseri=data.top;
      }
    });

    requestForMostRestrictiveUsers.error(function(data,status,headers,config){

    });
  };

  $scope.visitProfile=function(profil){
    $scope.showAlert("Profil","vizitez profilul:"+profil);
  };

}]);
