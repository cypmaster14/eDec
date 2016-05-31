﻿angular.module('edec').controller("searchProduct",['$scope','$http','$window', '$ionicPopup','$anchorScroll', '$timeout','$state','$rootScope','pagina','produs',function ($scope,$http,$window,$ionicPopup,$anchorScroll,$timeout,$state,$rootScope,pagina,produs) {

  $scope.showAlert=function(titlu,mesaj)
  {
      var alertPopup=$ionicPopup.alert({
        title:titlu,
        template:mesaj
      });

        /*alertPopup.then(function (res) {
         console.log("You clicked Ok");
      });*/
  };

  $scope.clickOnProduct=function (produs) {
     $state.go("tabs.product",{'ok':'ok','barcode':produs});
  };

  $scope.getNumberOfRecords=function(){
	  $scope.existaNext=false;
	  $scope.products=[];
	  pagina=0;
	  $scope.fakePage=0;
	  if(!$scope.searchedProduct)
      {
        $scope.showAlert('Search',"Enter a product");
        return;
      }
	  if ($rootScope.user==null){
		$rootScope.user='';
	  } 
	  if ($rootScope.user!=''){
		  $scope.displayPreferences=true;
	  }else{
		  $scope.displayPreferences=false;
	  }
	  var numarProduse=$http.get('https://nodeserve-cypmaster14.c9users.io/numarProduse?product='+$scope.searchedProduct);

        numarProduse.success( function (data,status,headers,config) {

          if(status==200)
           {
              $scope.numarProduse=data.linii;
               $anchorScroll('top-nav');
			  if ($scope.numarProduse>0) {
				  $scope.search();
			  }
			   else
              {
                $scope.showAlert("Find","Product was not found");
              }
          }
       });

       numarProduse.error(function  (data,status,headers,config) {
               $scope.showAlert("Error on request",status+' '+headers);
            });
  }
  
  $scope.search=function () {
	$scope.fakePage++;
	if ($scope.fakePage%2==1){
		pagina++;
		$scope.showAlert('Search',"Pagina "+pagina);
		console.log($rootScope.user);
		var res=$http.get('https://nodeserve-cypmaster14.c9users.io/products?product='+$scope.searchedProduct+"&pagina="+pagina);

		res.success(function (data,status,headers,config) {

			if(status==200)
			{
				$scope.text=data.text;
				if($scope.text.localeCompare("Gasit")==0) //produsul a fost gasit
				{
					for (i=0;i<data.products.length;i++){
						$scope.getPreferences(data.products[i]);
					}
					$scope.products.push.apply($scope.products,data.products);
				}
			}

		});

		res.error(function  (data,status,headers,config) {
            $scope.showAlert("Error on request",status+' '+headers);
		});
		
		if(pagina*10<$scope.numarProduse) {
			$scope.existaNext=true;
		} else {
			$scope.existaNext=false;
		}
	}
	$scope.$broadcast('scroll.infiniteScrollComplete');
  };
  
  $scope.getPreferences=function (product){
	if ($rootScope.user!=''){
		var pref=$http.get('https://nodeserve-cypmaster14.c9users.io/getPreferences?user='+$rootScope.user+"&barcode="+product.barcode);
		
		pref.success(function (data,status,headers,config){
			if (status==200){
				product.likes=data.likes;
				product.dislikes=data.dislikes;
				product.alerts=data.alerts;
			}
			else{
				console.log("Nu am primit preferinte pt: "+product.barcode);
			}
		});
	}
  }

}]);