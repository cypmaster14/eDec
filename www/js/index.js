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
}]);