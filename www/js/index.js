angular.module('ionicApp', ['ionic', 'ngCordova'])

.value('pagina',1)
.value('produs','')
.value('logat',false)
.value('user',"")

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
	  cache: false,
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
		  controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "templates/facts.html"
        }
      }
    })

    .state('tabs.register',{
      url:"/register",
      views: {
        'home-tab': {
          templateUrl: "templates/register.html"
        }
      }
    })


    .state('tabs.product', {
      url: "/product",
	   params:
	  { "ok":"ok",
		"barcode" : "empty"},
      views: {
        'home-tab': {
          templateUrl: "templates/product.html",
		  controller: 'ProductCtrl'
        }
      }
    })
    .state('tabs.search', {
      url: "/search",
      views: {
        'search-tab': {
          templateUrl: "templates/search.html"
        }
      }
    })


	.state('tabs.scan', {
      url: "/scan",
	  cache: false,
      views: {
        'scan-tab': {
          templateUrl: "templates/scan.html",
		  controller: "BarCode"
        }
      }
    });

   $urlRouterProvider.otherwise("/tab/home");

})

.directive('gestureOnHold',function($ionicGesture ) {
    return function(scope,element,attrs) {
        $ionicGesture.on('hold',function() {
            scope.$apply(function() {
                //console.log("held");
                scope.$eval(attrs.gestureOnHold);
            });
        },element);
    };
})

.controller('HomeTabCtrl',['$scope','$state', '$stateParams', '$ionicPopup', '$timeout','$rootScope','$http','$window','logat','user',function($scope,$state,$stateParams,$ionicPopup,$timeout,$rootScope,$http,$window,logat,user) {

   $scope.showAlert=function(titlu,mesaj)
    {
        var alertPopup=$ionicPopup.alert({
          title:titlu,
          template:mesaj
        });

        alertPopup.then(function (res) {

        });
    };

    $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.activate=function(obj){
  
  };

    $scope.showAlert('Stare:'+window.localStorage.getItem('logat'));

    $scope.initializeaza=function () {
       console.log("LocaleStorage Begin:"+window.localStorage.getItem('email'));
       var aux=window.localStorage.getItem('logat');
       console.log("Stare:"+aux);
      if(aux &&  aux.localeCompare("true")==0)
      {
          console.log("Sunt logat si initializez");
          $rootScope.user=window.localStorage.getItem('email');
          $rootScope.firstName=window.localStorage.getItem('firstName');
          $rootScope.lastName=window.localStorage.getItem('lastName');
          $rootScope.logat=true;
          logat=true;
      }
    };

    $scope.logout=function () {
      $scope.showAlert('Logout','I want to leave');
      logat=false;
      window.localStorage.clear();
      $rootScope.logat=false;
      $rootScope.user="";
      $rootScope.firstName="";
      $rootScope.lastName="";
      $state.go('tabs.home');

    };

}])

.controller('ProductCtrl',['$scope','$state', '$stateParams','$http', '$ionicPopup', '$timeout','$rootScope','$ionicActionSheet','logat','user',function($scope,$state,$stateParams,$http,$ionicPopup,$timeout,$rootScope,$ionicActionSheet,logat,user) {
	if ($stateParams.barcode != "empty") {
		$scope.barcode = $stateParams.barcode;

  $scope.showAlert=function(titlu,mesaj)
    {
        var alertPopup=$ionicPopup.alert({
          title:titlu,
          template:mesaj
        });

        alertPopup.then(function (res) {

        });
    };


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
                    $scope.showAlert('Optiune',optiune+' trimisa cu succes');
                }

                else
                {
                    $scope.showAlert("Product","Probleme la votarea optiunii");
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
                console.log(JSON.stringify(data));
                $scope.showAlert("Comentarii Primite");

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
            $scope.showAlert("Produs","Produs gasit");
            $scope.ingrediente=data.ingrediente;
            $scope.showAlert("Ingrediente gasite");
            $scope.comentarii=data.comentarii;
            $scope.showAlert("Comentarii Primite");
            console.log(JSON.stringify(data.comentarii));

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

}])

.controller("BarCode", ['$scope','$cordovaBarcodeScanner','$state',function($scope,$cordovaBarcodeScanner,$state) {
	 $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
			$state.go("tabs.product",{'ok':'ok','barcode':imageData.text});
        }, function(error) {
            $state.go("tabs.product");
			console.log("An error happened -> " + error);
        });
    };
}])

.config(function($httpProvider) {
    //Enable cross domain calls
   //  $httpProvider.defaults.useXDomain = true;

   //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

    //Remove the header containing XMLHttpRequest used to identify ajax call
    //that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.controller("registerPerson",['$scope','$http','$window', '$ionicPopup', '$timeout',function($scope,$http,$window,$ionicPopup,$timeout) {

  $scope.showAlert=function(titlu,mesaj)
  {
      var alertPopup=$ionicPopup.alert({
        title:titlu,
        template:mesaj
      });

      alertPopup.then(function (res) {

      });
  };

  $scope.register=function () {

    if(!$scope.email || !$scope.firstName || !$scope.lastName || !$scope.password)
    {

        $scope.showAlert('Try Again',"All field must be completed");
        return;
    }

    var email=$scope.email;
    var firstName=$scope.firstName;
    var lastName=$scope.lastName;
    var password=$scope.password;

    var obj={
                email:email,
                firstName:firstName,
                lastName:lastName,
                password:password
              };

      console.log(obj);

      var res=$http.post('https://nodeserve-cypmaster14.c9users.io/register',obj);
      res.success(function (data,status,headers,config) {
        if (status == 200) {
          $scope.mesaj=data;
          console.log("Text:"+$scope.mesaj.text);

          if($scope.mesaj.text.localeCompare('Account created')==0)
          {
            $scope.showAlert('Register','Succes');
            $window.location.href="/#/tab/facts";
          }

          else
          {
            $scope.showAlert('Registration failed',$scope.mesaj.text);
          }
        }
      });

      res.error(function (data,status,headers,config) {
         alert("Error on request"+status+' '+headers) ;

      });

  };

}])


.controller("searchProduct",['$scope','$http','$window', '$ionicPopup','$anchorScroll', '$timeout','$state','pagina','produs',function ($scope,$http,$window,$ionicPopup,$anchorScroll,$timeout,$state,pagina,produs) {


  $scope.products=[];

  $scope.showAlert=function(titlu,mesaj)
  {
      var alertPopup=$ionicPopup.alert({
        title:titlu,
        template:mesaj
      });

        alertPopup.then(function (res) {
         console.log("You clicked Ok");
      });
  };

  $scope.clickOnProduct=function (produs) {

     $state.go("tabs.product",{'ok':'ok','barcode':produs});
  };


  $scope.previous=function () {
     pagina=pagina-2;
     $scope.search('yes');
     $anchorScroll('top-nav');
  };


  $scope.search=function (option) {

      $scope.cautat=true;
      $scope.aux=0;
      if(!$scope.searchedProduct)
      {
        $scope.showAlert('Search',"Enter a product");
        return;
      }

      if(option.localeCompare('no')==0)
      {
        produs=$scope.searchedProduct;
        pagina=1;
      }
      else
        pagina=pagina+1;


      // if(produs.localeCompare($scope.searchedProduct)==0)
      // {

      //   pagina=pagina+1;
      // }
      // else
      // {
      //   produs=$scope.searchedProduct;
      //   pagina=1;
      // }
      $scope.showAlert('Search','You search'+$scope.searchedProduct+" pagina"+pagina);


      if(1==1)
      {
        var numarProduse=$http.get('https://nodeserve-cypmaster14.c9users.io/numarProduse?product='+$scope.searchedProduct);

        numarProduse.success( function (data,status,headers,config) {

          if(status==200)
           {
              $scope.nrProduse=data.linii;
               if(data.linii!=0)
               {
                 console.log("Numar produse in functie:"+$scope.nrProduse);
                 console.log("Pagina:"+pagina);
                  if(pagina*10-10<=0) // am pus 10 pt ca am 10 produse pe pagina daca vreau sa modific trebuie sa modific si din serve
                      $scope.existaPrevious=false;
                  else
                      $scope.existaPrevious=true;

                  if(pagina*10<data.linii)
                     $scope.existaNext=true;
                   else
                       $scope.existaNext=false;
               }

               console.log("Next:"+$scope.existaNext);
               console.log("Previous:"+$scope.existaPrevious);
               $anchorScroll('top-nav');

          }
       });

       numarProduse.error(function  (data,status,headers,config) {
               $scope.showAlert("Error on request",status+' '+headers);
            });


      }



      var res=$http.get('https://nodeserve-cypmaster14.c9users.io/products?product='+$scope.searchedProduct+"&pagina="+pagina);

      res.success(function (data,status,headers,config) {

          if(status==200)
          {
              $scope.text=data.text;
              if($scope.text.localeCompare("Gasit")==0) //produsul a fost gasit
              {

                  $scope.products=data.products;
                  $scope.paginaExista=true;
                  console.log($scope.paginaExista);
                  console.log("Numar produse in afara:"+$scope.nrProduse);



                  console.log("next:" +$scope.existaNext);
                  console.log("previous:" +$scope.existaPrevious);
              }
              else
              {
                $scope.showAlert("Find","Product was not found");
              }
          }

      });

      res.error(function  (data,status,headers,config) {
            $scope.showAlert("Error on request",status+' '+headers);
        });

  };

}])


.controller("logIn",['$scope','$state', '$stateParams','$http','$window', '$ionicPopup', '$timeout','$rootScope','logat','user',function ($scope,$state,$stateParams,$http,$window,$ionicPopup,$timeout,$rootScope,logat,user) {

  $scope.showAlert=function(titlu,mesaj)
  {
      var alertPopup=$ionicPopup.alert({
        title:titlu,
        template:mesaj
      });

        alertPopup.then(function (res) {
         console.log("You clicked Ok");
      });
  };

  $scope.login=function () {

     if(!$scope.email || !$scope.password)
     {
        $scope.showAlert("Try Again","All fields must be completted");
        return;
     }

     var email=$scope.email;
     var password=$scope.password;

     var obj={
                email:email,
                password:password
              };

    console.log(obj);

    var res=$http.post('https://nodeserve-cypmaster14.c9users.io/login',obj);

    res.success(function (data,status,headers,config) {
       if(status==200) //succes
       {
          $scope.mesaj=data;

          if($scope.mesaj.text.localeCompare('Login Succes')==0)
          {
            logat=true;
            $rootScope.logat=true;
            $rootScope.user=obj.email;
            console.log("Nume:"+data.firstName);
            $rootScope.firstName=data.firstName;
            $rootScope.lastName=data.lastName;
            $scope.showAlert('Login','Loged as '+$rootScope.user+"(Log="+$rootScope.logat+")"+$rootScope.firstName+" "+$rootScope.lastName);
            $state.go("tabs.home");
            window.localStorage.setItem("email",$rootScope.user);
            window.localStorage.setItem("firstName",$rootScope.firstName);
            window.localStorage.setItem("lastName",$rootScope.lastName);
            window.localStorage.setItem("logat",$rootScope.logat);
            console.log("LocaleStorage:"+window.localStorage.getItem('email'));
          }
          else
          {
            $scope.showAlert('Login failed',$scope.mesaj.text);
          }
       }
    });

    res.error(function  (data,status,headers,config) {
       alert("Error on request"+status+' '+headers);
    });

  };

}]);
