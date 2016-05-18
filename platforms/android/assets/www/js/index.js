

angular.module('ionicApp', ['ionic', 'ngCordova'])

.value('pagina',1)
.value('produs','')


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



.controller('HomeTabCtrl',['$scope','$state', '$stateParams', '$ionicPopup', '$timeout',function($scope,$state,$stateParams,$ionicPopup,$timeout) {

   $scope.showAlert=function(titlu,mesaj)
    {
        var alertPopup=$ionicPopup.alert({
          title:titlu,
          template:mesaj
        });

        alertPopup.then(function (res) {
           
        });
    };

  $scope.afiseaza=function () {
     $scope.showAlert('AAA','mesaj');
  }
}])

.controller('ProductCtrl',['$scope','$state', '$stateParams','$http', '$ionicPopup', '$timeout',function($scope,$state,$stateParams,$http,$ionicPopup,$timeout) {
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
            $scope.showAlert('Optiune',opriune+' trimisa cu succes');
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

  $scope.dislikeImage=function(ingredient){
    alert('Dislike'+ingredient);
  };



    var res=$http.get('https://nodeserve-cypmaster14.c9users.io/product?barcode='+$scope.barcode);

    res.success(function (data,status,headers,config) {

        if(status==200)
        {
          $scope.mesaj=data;
         
          if($scope.mesaj.mesaj.localeCompare("Gasit")==0) //produsul a fost gasit
          {
              alert("Produs gasit");
              var resIngredients=$http.get('https://nodeserve-cypmaster14.c9users.io/ingredients?barcode='+$scope.barcode);
              resIngredients.success(function (data,status,headers,config){

                    if(status==200)
                      {
                          alert("Ingrediente gasite");
                          $scope.ingrediente=data.ingrediente;// setez ingredientele spre a fi puse in pagina de produse
                          
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


.controller("searchProduct",['$scope','$http','$window', '$ionicPopup','$anchorScroll', '$timeout','pagina','produs',function ($scope,$http,$window,$ionicPopup,$anchorScroll,$timeout,pagina,produs) {
  

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
     
     alert("Click on "+produs)
  };


  $scope.previous=function () {
     pagina=pagina-2;
     $scope.search();
     $anchorScroll('top-nav');
  };


  $scope.search=function () {
     
      $scope.cautat=true;
      $scope.aux=0;


      if(produs.localeCompare($scope.searchedProduct)==0)
      {
        pagina=pagina+1;
      }
      else
      {
        produs=$scope.searchedProduct;
        pagina=1;
      }
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



  }

}])


.controller("logIn",['$scope','$http','$window', '$ionicPopup', '$timeout',function ($scope,$http,$window,$ionicPopup,$timeout) {
   
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
            $window.location.href="/#/tab/home";
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


