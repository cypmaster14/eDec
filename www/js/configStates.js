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
                  templateUrl: "templates/home.html"
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

      .state('tabs.addProduct',{
        url:"/addProduct",
        views:{
            "home-tab":{
              templateUrl:"templates/addProduct.html"
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
		 params: {	campaign_name: null,
					campaign_id: null,
					campaign_description: null,
					imagine: null,
					creation_date: null,
					administrator: null
		 },
		views: {
			'home-tab':{
				templateUrl: "templates/campaign.html"
			}
		}
	  })
	  .state('tabs.createCampaign',{
		url:"/createCampaign",
		params:
		{ "ok":"ok",
             "barcode" : "empty"},
		views: {
			'home-tab':{
				templateUrl: "templates/createCampaign.html"
			}
		}
	  })

      .state('tabs.product', {
          url: "/product",
          cache: false,
          params:
         { "ok":"ok",
             "barcode" : "empty"},
          views: {
              'home-tab': {
                  templateUrl: "templates/product.html"
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
                  templateUrl: "templates/scan.html"
              }
          }
      });

    $urlRouterProvider.otherwise("/tab/home");

})
