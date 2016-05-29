angular.module('edec').controller('ProductCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
    if ($stateParams.barcode != "empty") {
        $scope.barcode = $stateParams.barcode;
        /*
        $scope.showAlert=function(titlu,mesaj)
        {
            var alertPopup=$ionicPopup.alert({
                title:titlu,
                template:mesaj
            });

            alertPopup.then(function (res) {

            });
        };*/


        $scope.showPopup=function(ingredient,optiune){

            $scope.data={};
            $ionicPopup.show({
                template:'<input type="text" placeholder="Enter Reason" ng-model="data.model">',
                title:"Enter Reason",
                subTitle:"Why do you "+optiune+" "+ingredient,
                scope:$scope,
                buttons:[
                  {text:'Cancel'},
                  {
                      text:'Submit',
                      type:'button-positive',
                      onTap:function(e)
                      {
                          if(!$scope.data.model)
                          {
                              e.preventDefault();
                          }
                          else {
                              console.log('Am introdus un motiv:'+$scope.data.model);
                              var obj={
                                  ingredient:ingredient,
                                  user:$rootScope.user,
                                  optiune:optiune,
                                  motiv:$scope.data.model
                              };


                              var res=$http.post('https://nodeserve-cypmaster14.c9users.io/optiuneIngredient',obj);

                              res.success(function (data,status,headers,config) {

                                  if(status==200)
                                  {
                                      $scope.showAlert('New preference',data);
                                  }

                                  else
                                  {
                                      $scope.showAlert("Error","There was a problem when sending your preference.");
                                  }

                              });


                              res.error(function (data,status,headers,config) {
                                  alert("Error on request la trimiterea optiunii asupra ingredientului"+status+' '+headers) ;

                              });
                          }

                      }
                  }
                ]
            });
        };

        $scope.likeImage=function (ingredient,optiune) {

            if(!$rootScope.user)
            {
                $scope.showAlert('Login','You must login first');
                return;
            }


            $scope.showPopup(ingredient,optiune);
        };

        $scope.ratingValue=1;
        $scope.setRating=function(rating) {
            $scope.ratingValue=rating;
            console.log('Modific rating:'+$scope.ratingValue);
        };

        $scope.postareComentariu=function()
        {
            console.log($rootScope.logat);
            console.log($rootScope.user);
            console.log("Scor"+$scope.ratingValue);
            if(!$rootScope.logat || $rootScope.logat==false)
            {
                $scope.showAlert('LogIn','You must login first');
                return;
            }
            else if($scope.iol.length!=0)
            {

                console.log($rootScope.logat);
                var review= $scope.iol;
                if(review.length==0)
                {
                    $scope.showAlert('Review','Insert a review');
                    return;
                }
                $scope.showAlert('Postare comentariu','('+$rootScope.user+')Mesaj:'+review);
                console.log('Email:'+$rootScope.user);
                console.log('Barcode:'+$scope.barcode);
                console.log('Comentariu:'+review);

                var obj={
                    email:$rootScope.user,
                    barcode:$scope.barcode,
                    title:$scope.titlu,
                    grade:$scope.ratingValue,
                    review:review

                };
                console.log("Trimit obiectul:"+JSON.stringify(obj));

                $scope.titlu="";
                $scope.iol="";
                var res=$http.post('https://nodeserve-cypmaster14.c9users.io/adaugaComentariu',obj);
                res.success (function (data,status,headers,config) {

                    if(status==200)
                    {
                        $scope.showAlert('Titlu','Mesajul a fost postat cu succes');
                        var resComments=$http.get('https://nodeserve-cypmaster14.c9users.io/reviews?barcode='+$scope.barcode);

                        resComments.success(function (data,status,headers,config){
                            if(status==200)
                            {
                                $scope.comentarii=data.comentarii;
                            }

                        });

                        resComments.error(function (data,status,headers,config) {
                            alert("Error on request la obtinerea comentariilor"+status+' '+headers) ;
                        });
                    }
                });

                res.error(function (data,status,headers,config) {
                    alert("Error on request postarea comentariului"+status+' '+headers) ;

                });


            }

        };



        $scope.showAditionalMenu=function(ingredient)
        {
            if(!$rootScope.user)
            {
                $scope.showAlert('Login','You must login first');
                return;
            }
            var hideSheet=  $ionicActionSheet.show({
                titleText:"Preference",
                buttons:[
                            {text:'<i class="icon ion-happy-outline"></i>Like '},
                            {text:'<i class="icon ion-sad-outline"></i><em>Dislike</em>'},
                            {text:'<i class="icon ion-android-alert"></i><b>Alert</b>'},
                ],
                cancelText:'Cancel',
                cancel:function(){
                    console.log("Cancelled");
                },
                buttonClicked:function(index){
                    var optiune="";
                    switch(index){
                        case 0:
                            optiune="Like";
                            break;
                        case 1:
                            optiune="Dislike";
                            break;
                        case 2:
                            optiune="Alert";
                            break;
                    }

                    console.log(optiune+" la ingredientul "+ingredient);
                    var aux=$scope.showPopup(ingredient,optiune);
                    return true; //Pentru a disparea meniul cu optiuni dupa ce dau click
                }
            });
        };



        ////Noul Request/////////////
        var res=$http.get('https://nodeserve-cypmaster14.c9users.io/productPage?barcode='+$scope.barcode);

        res.success(function (data,status,headers,config) {
            if(status==200)
            {
                if(data.mesaj.localeCompare("Gasit")==0)
                {
                    $scope.mesaj=data;
<<<<<<< HEAD
                    $scope.ingrediente=data.ingrediente;
                    $scope.comentarii=data.comentarii;
                    console.log(JSON.stringify(data.comentarii));
					$scope.campanii=data.campanii;
					$scope.nrUsers=data.nrUsers;
					$scope.data = { isLoading: true};
=======
                    //$scope.showAlert("Produs","Produs gasit");
                    $scope.ingrediente=data.ingrediente;
                    //$scope.showAlert("Ingrediente gasite");
                    $scope.comentarii=data.comentarii;
                    //$scope.showAlert("Comentarii Primite");
                    //console.log(JSON.stringify(data.comentarii));

>>>>>>> 617804ee5c27160544e233be957a3b5c96f44193
                }
                else
                {
                    $state.go("tabs.home");
                    $scope.showAlert("Product","Product was not found");
                }
            }
        });

        res.error(function (data,status,headers,config) {
            alert("Error on request la obtinerea produsului"+status+' '+headers) ;

        });

        /////Sfarsitul Noului Request////




    }

}]);