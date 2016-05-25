angular.module('edec').controller("searchProduct",['$scope','$http','$window', '$ionicPopup','$anchorScroll', '$timeout','$state','pagina','produs',function ($scope,$http,$window,$ionicPopup,$anchorScroll,$timeout,$state,pagina,produs) {


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

}]);