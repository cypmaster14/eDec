angular.module('edec').config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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

      .state('tabs.profile', {
        url:"/profile",
        views:{
            "home-tab":{
              templateUrl:"templates/profile.html"
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
	  .state('tabs.campaign',{
		url:"/campaign",
		 params: { obj:null
	     },
		views: {
			'home-tab':{
				templateUrl: "templates/campaign.html",
				controller: 'CampaignCtrl'
				
			}
		}
	  })
	  .state('tabs.createCampaign',{
		url:"/createCampaign",
		views: {
			'home-tab':{
				templateUrl: "templates/createCampaign.html",
				controller: 'CreateCampaignCtrl'
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
