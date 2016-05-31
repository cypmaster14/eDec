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
		$scope.creation_date=$stateParams.obj.creation_date.substring(0,10);
		$scope.administrator=$stateParams.obj.administrator;
		$scope.getNumberOfMembersFor($stateParams.obj);
	}
	else{
		alert("empty");
	}
	$scope.joinCampaign=function(){
	 if (!$rootScope.logat || $rootScope.logat == false) {
        $scope.showAlert('LogIn', 'Trebuie sa fiti logat!');
        return;
     }	
	}
	$scope.postareComentariu = function () {
            console.log($rootScope.logat);
            console.log($rootScope.user);
            if (!$rootScope.logat || $rootScope.logat == false) {
                $scope.showAlert('LogIn', 'Trebuie sa fiti logat!');
                return;
            }
            if ( $scope.iol && $scope.iol.length !== 0 && $scope.titlu  && $scope.titlu.length!==0) {

                console.log($rootScope.logat);
                var review = $scope.iol;
                $scope.showAlert('Postare comentariu', '(' + $rootScope.user + ')Mesaj:' + review);
                console.log('Email:' + $rootScope.user);
                console.log('Barcode:' + $scope.barcode);
                console.log('Comentariu:' + review);
				console.log('Titlu:'+$scope.titlu);

                var obj = {
                    email: $rootScope.user,
                    barcode: $scope.barcode,
                    title: $scope.titlu,
                    grade: $scope.ratingValue,
                    review: review

                };
                console.log("Trimit obiectul:" + JSON.stringify(obj));

                $scope.titlu = "";
                $scope.iol = "";
                /*var res = $http.post('https://nodeserve-cypmaster14.c9users.io/adaugaComentariu', obj);
                res.success(function (data, status, headers, config) {

                    if (status == 200) {
                        $scope.showAlert('Titlu', 'Mesajul a fost postat cu succes');
                        var resComments = $http.get('https://nodeserve-cypmaster14.c9users.io/reviews?barcode=' + $scope.barcode);

                        resComments.success(function (data, status, headers, config) {
                            if (status == 200) {
                                $scope.comentarii = data.comentarii;
                            }

                        });

                        resComments.error(function (data, status, headers, config) {
                            alert("Error on request la obtinerea comentariilor" + status + ' ' + headers);
                        });
                    }
                });


                res.error(function (data,status,headers,config) {
                    if(status==409)
                    {
                      $scope.showAlert('Comentariu',"Ati postat deja un comentariu");
                    }

                }); */


            }
			else{
              $scope.showAlert('Comentariu','Completati toate campurile');
              return;
            }

    };
}]);
   