

angular.module('ionicApp', ['ionic', 'ngCordova'])

.value('pagina',1)
.value('produs','')
.value('logat',false)
.value('user',"")



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



.controller('HomeTabCtrl',['$scope','$state', '$stateParams', '$ionicPopup', '$timeout','$rootScope',function($scope,$state,$stateParams,$ionicPopup,$timeout,$rootScope) {

   $scope.showAlert=function(titlu,mesaj)
    {
        var alertPopup=$ionicPopup.alert({
          title:titlu,
          template:mesaj
        });

        alertPopup.then(function (res) {

        });
    };


    $scope.showAlert('Stare:'+$rootScope.logat);


    $scope.logout=function () {
       $scope.showAlert('Logout','I want to leave') ;
       //Sa fac requestul ce distruge sesiunea
    }

    //Trebuie sa fac requestul ce deschide sesiunea






}])

.controller('ProductCtrl',['$scope','$state', '$stateParams','$http', '$ionicPopup', '$timeout','$rootScope','logat','user',function($scope,$state,$stateParams,$http,$ionicPopup,$timeout,$rootScope,logat,user) {
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

  $scope.likeImage=function (ingredient,optiune) {

     $scope.showAlert(optiune,ingredient);
     var obj={
                ingredient:ingredient,
                user:'cypmaster14',
                optiune:optiune
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


  };

  $scope.ratingValue=1;
  $scope.setRating=function(rating) {
     $scope.ratingValue=rating;
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
      var review= $scope.iol
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
      console.log(JSON.stringify(obj));

      
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

  $scope.setRating=function () {
      
  }



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

  /*

    var res=$http.get('https://nodeserve-cypmaster14.c9users.io/product?barcode='+$scope.barcode);

    res.success(function (data,status,headers,config) {

        if(status==200)
        {
          $scope.mesaj=data;

          if($scope.mesaj.mesaj.localeCompare("Gasit")==0) //produsul a fost gasit
          {
              $scope.showAlert("Produs","Produs gasit");
              var resIngredients=$http.get('https://nodeserve-cypmaster14.c9users.io/ingredients?barcode='+$scope.barcode);
              resIngredients.success(function (data,status,headers,config){

                    if(status==200)
                      {
                          $scope.showAlert("Ingrediente gasite");
                          $scope.ingrediente=data.ingrediente;// setez ingredientele spre a fi puse in pagina de produse

                          var resComments=$http.get('https://nodeserve-cypmaster14.c9users.io/reviews?barcode='+$scope.barcode);

                          resComments.success(function (data,status,headers,config){

                              if(status==200)
                              {
                                $scope.showAlert("Comentarii Primite");
                                if(data.comentarii.length>0)
                                  $scope.comentarii=data.comentarii;
                              }

                          });

                          resComments.error(function (data,status,headers,config) {
                                  alert("Error on request la obtinerea comentariilor"+status+' '+headers) ;

                        });




                      }


                  });

                resIngredients.error(function (data,status,headers,config) {
                      alert("Error on request la obtinerea ingredientelor"+status+' '+headers) ;

                        });

          }
          else
          {
            $state.go("/tab/home");
            $scope.showAlert("Product","Product was not found");
          }
        }


    });

    res.error(function (data,status,headers,config) {
         alert("Error on request la obtinerea produsului"+status+' '+headers) ;

      });

  */



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
            $scope.showAlert('Registration failed',$scope.mesaj.text)
          }
        }
      });

      res.error(function (data,status,headers,config) {
         alert("Error on request"+status+' '+headers) ;

      });

  }

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
          }
          else
          {
            $scope.showAlert('Login failed',$scope.mesaj.text)
          }
       }
    });

    res.error(function  (data,status,headers,config) {
       alert("Error on request"+status+' '+headers);
    });

  }

}]);





