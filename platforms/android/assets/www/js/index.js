angular.module('ionicApp', ['ionic', 'ngCordova'])

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



.controller('HomeTabCtrl',['$scope','$state', '$stateParams',function($scope,$state,$stateParams) {
}])

.controller('ProductCtrl',['$scope','$state', '$stateParams',function($scope,$state,$stateParams) {
	if ($stateParams.barcode != "empty") { 
		$scope.barcode = $stateParams.barcode;
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

.controller("registerPerson",['$scope','$http',function($scope,$http) {

  


  $scope.register=function () {

    if(!$scope.email || !$scope.firstName || !$scope.lastName || !$scope.password)
    {

        alert("All field must be completede");
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

      var res=$http.post('https://nodeserve-cypmaster14.c9users.io',obj);
      res.success(function (data,status,headers,config) {
        if (status == 200) {
          $scope.mesaj=data;
          console.log($scope.mesaj.email+" Text:"+$scope.mesaj.text);
          alert($scope.mesaj.email+" Text:"+$scope.mesaj.text);
        }
      });

      res.error(function (data,status,headers,config) {
         alert("Error on request"+status+' '+headers) ;

      });

  }

  


}]);

