<<<<<<< HEAD
﻿angular.module('edec').controller('ProductCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat','user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
=======
﻿angular.module('edec').controller('ProductCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicPopup', '$timeout', '$rootScope', '$ionicActionSheet', 'logat', 'user', function ($scope, $state, $stateParams, $http, $ionicPopup, $timeout, $rootScope, $ionicActionSheet, logat, user) {
>>>>>>> 1eea69c3940dd03b3bb7c9760dba765d5689af9e

    if ($stateParams.barcode != "empty") {
        $scope.barcode = $stateParams.barcode;

        var productInfo = {
            barcode: $scope.barcode,
            user: $rootScope.user
        };
        var productResponse = $http.post('https://nodeserve-cypmaster14.c9users.io/productPage', productInfo);

        productResponse.success(function (data, status, headers, config) {
            if (status == 200) {
                if (data.mesaj.localeCompare("Gasit") == 0) {
                    $scope.mesaj = data;

                    var ingredients = getProductIngredients(data.product_ingredients, data.user_voted_ingredients);
                    $scope.likedIngredients = getIngredients(ingredients, "Like");
                    $scope.dislikedIngredients = getIngredients(ingredients, "Dislike");
                    $scope.alertedIngredients = getIngredients(ingredients, "Alert");
                    $scope.neutralIngredients = getIngredients(ingredients, "Neutral");
                    $scope.neutralIngredientsDisplayMessage = getNeutralIngredientsDisplayMessage($scope);
                    $scope.comentarii = data.comentarii;
                    $scope.campanii = data.campanii;
                    $scope.comentarii = data.comentarii;
                }
                else {
                    $state.go("tabs.home");
                    $scope.showAlert("Product", "Product was not found");
                }
            }
        });

        productResponse.error(function (data, status, headers, config) {
            alert("Error on request la obtinerea produsului" + status + ' ' + headers);

        });

        function translateOption(option) {
            switch (option) {
                case "Like":
                    return "va  place ingredientul ";
                case "Dislike":
                    return "nu va place ingredientul ";
                case "Alert":
                    return "considerati un pericol ingredientul "
            }
        }

        $scope.showPopup = function (ingredient, optiune) {

            $scope.data = {};
            $ionicPopup.show({
                template: '<input type="text" placeholder="Introduceti motivul" ng-model="data.model">',
                title: "Preferinta noua",
                subTitle: "De ce " + translateOption(optiune) + ingredient + "?",
                scope: $scope,
                buttons: [
                  { text: 'Anuleaza' },
                  {
                      text: 'Salveaza',
                      type: 'button-positive',
                      onTap: function (e) {
                          if (!$scope.data.model) {
                              e.preventDefault();
                          }
                          else {
                              var obj = {
                                  ingredient: ingredient,
                                  user: $rootScope.user,
                                  optiune: optiune,
                                  motiv: $scope.data.model
                              };


                              var res = $http.post('https://nodeserve-cypmaster14.c9users.io/optiuneIngredient', obj);

                              res.success(function (data, status, headers, config) {

                                  if (status == 200) {
                                      $scope.showAlert('Preferinta noua',data);
                                  }

                                  else {
                                      //$scope.showAlert("Error","There was a problem when sending your preference.");
                                  }

                              });


                              res.error(function (data, status, headers, config) {
                                  alert("Error on request la trimiterea optiunii asupra ingredientului" + status + ' ' + headers);

                              });
                          }

                      }
                  }
                ]
            });
        };

        $scope.likeImage = function (ingredient, optiune) {

            if (!$rootScope.user) {
                $scope.showAlert('Login', 'You must login first');
                return;
            }


            $scope.showPopup(ingredient, optiune);
        };

        $scope.ratingValue = 1;
        $scope.setRating = function (rating) {
            console.log("Sterg checked de la:" + 'group-3-' + (5 - $scope.ratingValue));
            document.getElementById('group-3-' + (5 - $scope.ratingValue)).checked = "false";
            document.getElementById('group-3-' + (5 - $scope.ratingValue)).removeAttribute('checked');
            //$('#group-3-'+(5-$scope.ratingValue)).prop('checked',false);
            $scope.ratingValue = rating;
            console.log('Modific rating:' + $scope.ratingValue);
            console.log("Bifez steaua cu id:" + 'group-3-' + (5 - rating));
            document.getElementById('group-3-' + (5 - rating)).checked = "true";
            document.getElementById('group-3-' + (5 - rating)).setAttribute('checked', "true");
            //  $('#group-3-'+(5-rating)).prop('checked',true);
        };

        $scope.postareComentariu = function () {
            console.log($rootScope.logat);
            console.log($rootScope.user);
            console.log("Scor" + $scope.ratingValue);
            if (!$rootScope.logat || $rootScope.logat === false) {
                $scope.showAlert('LogIn', 'You must login first');
                return;
            }
            if ( $scope.iol && $scope.iol.length !== 0 && $scope.titlu  && $scope.titlu.length!==0) {

                console.log($rootScope.logat);
                var review = $scope.iol;
                $scope.showAlert('Postare comentariu', '(' + $rootScope.user + ')Mesaj:' + review);
                console.log('Email:' + $rootScope.user);
                console.log('Barcode:' + $scope.barcode);
                console.log('Comentariu:' + review);

                var obj = {
                    email: $rootScope.user,
                    barcode: $scope.barcode,
                    title: $scope.titlu,
                    grade: $scope.ratingValue,
                    review: review

                };
                console.log("Trimit obiectul:" + JSON.stringify(obj));

                $scope.titlu = "";
                $scope.iol = "";
                var res = $http.post('https://nodeserve-cypmaster14.c9users.io/adaugaComentariu', obj);
                res.success(function (data, status, headers, config) {

                    if (status == 200) {
                        $scope.showAlert('Titlu', 'Mesajul a fost postat cu succes');
                        var resComments = $http.get('https://nodeserve-cypmaster14.c9users.io/reviews?barcode=' + $scope.barcode);

                        resComments.success(function (data, status, headers, config) {
                            if (status == 200) {
                                $scope.comentarii = data.comentarii;
                            }

                        });

                        resComments.error(function (data, status, headers, config) {
                            alert("Error on request la obtinerea comentariilor" + status + ' ' + headers);
                        });
                    }
                });


                res.error(function (data,status,headers,config) {
                    if(status==409)
                    {
                      $scope.showAlert('Comentariu',"Ati postat deja un comentariu");
                    }

                });


            }

            else
            {
              $scope.showAlert('Comentariu','Completati toate campurile');
              return;
            }
        };

        function showPreferenceMenu(ingredient) {
            var hideSheet = $ionicActionSheet.show({
                titleText: "Alegeti preferinta",
                buttons: [
                            { text: '<i class="icon ion-happy-outline"></i>Imi place ' },
                            { text: '<i class="icon ion-sad-outline"></i><em>Nu imi place</em>' },
                            { text: '<i class="icon ion-android-alert"></i><b>Pericol</b>' },
                ],
                cancelText: 'Cancel',
                cancel: function () {
                    console.log("Cancelled");
                },
                buttonClicked: function (index) {
                    var optiune = "";
                    switch (index) {
                        case 0:
                            optiune = "Like";
                            break;
                        case 1:
                            optiune = "Dislike";
                            break;
                        case 2:
                            optiune = "Alert";
                            break;
                    }

                    console.log(optiune + " la ingredientul " + ingredient);
                    var aux = $scope.showPopup(ingredient, optiune);
                    return true; //Pentru a disparea meniul cu optiuni dupa ce dau click
                }
            });
        }

        function showReasonMenu(ingredient, reason) {
            var template = reason + "<br>Doriti sa schimbati preferinta?"
            var confirmPopup = $ionicPopup.confirm({
                title: 'Motivul optiunii',
                template: template,
                cancelText: 'Nu',
                okText: 'Da'
            }).then(function (response) {
                if (response) {
                    showPreferenceMenu(ingredient);
                }
            });
        }

        $scope.showAditionalMenu = function (ingredient, option, reason) {
            if (!$rootScope.user) {
                $scope.showAlert('Login', 'Va rugam sa va autentificati');
                return;
            }
            if (option === "Neutral") {
                showPreferenceMenu(ingredient);
            } else {
                showReasonMenu(ingredient, reason);
            }
        };


        ////Noul Request/////////////


        //get ingredients depending on option (Like,Dislike,Alert,Neutral)
        function getIngredients(ingredients, option) {
            var returnedIngredientes = [];
            for (var i in ingredients) {
                if (ingredients[i].option === option) {
                    returnedIngredientes.push(ingredients[i]);
                }
            }
            return returnedIngredientes;
        }



        //merge product ingredients with the ingredients voted by user
        function getProductIngredients(product_ingredients, user_voted_ingredients) {

            var returned_ingredients = [];

            //add exactly matched ingredients
            var product_ingredients_size = product_ingredients.length;
            for (var i = 0; i < product_ingredients_size; i++) {
                for (var j in user_voted_ingredients) {
                    if (product_ingredients[i].toUpperCase() == user_voted_ingredients[j].ingredient_name.toUpperCase()) {

                        var ingredient = {
                            name: user_voted_ingredients[j].ingredient_name,
                            option: user_voted_ingredients[j].preference,
                            reason: user_voted_ingredients[j].reason
                        };
                        returned_ingredients.push(ingredient);
                        product_ingredients.splice(i, 1);
                        i--;
                        product_ingredients_size--;
                        break;
                    }
                }
            }

            //add substring ingredients : lapte -> lapte praf
            for (var i = 0; i < product_ingredients_size; i++) {
                for (var j in user_voted_ingredients) {
                    if (product_ingredients[i].toUpperCase().indexOf(user_voted_ingredients[j].ingredient_name.toUpperCase()) > -1) {
                        var ingredient = {
                            name: product_ingredients[i],
                            option: user_voted_ingredients[j].preference,
                            reason: deductReason(user_voted_ingredients[j].ingredient_name, user_voted_ingredients[j].preference)
                        };
                        returned_ingredients.push(ingredient);
                        product_ingredients.splice(i, 1);
                        i--;
                        product_ingredients_size--;
                        break;
                    }
                }
            }

            //add remaining ingredients(not voted)
            for (var i in product_ingredients) {
                var ingredient = {
                    name: product_ingredients[i],
                    option: "Neutral",
                    reason: ""
                }
                returned_ingredients.push(ingredient);
            }
            return returned_ingredients;
        };

        function deductReason(name, option) {
            switch (option) {
                case "Like":
                    return "Ingredientul " + name + " se numara printre preferintele dumneavoastra.";
                case "Dislike":
                    return "Ingredientul " + name + " a fost semnalat ca fiind dezagreabil pentru dumneavoastra.";
                case "Alert":
                    return "Ingredientul " + name + " a fost semanalat ca fiind un pericol pentru dumneavoastra.";
            }
        }

        //Get the displayed message for neutral ingredients depending on the other voted ingredients, if they exist
        function getNeutralIngredientsDisplayMessage(scope) {
            if (scope.likedIngredients.length + scope.dislikedIngredients.length + scope.alertedIngredients.length > 0) {
                return "Alte ingrediente";
            } else {
                return "";
            }
        }

        $scope.clickOnCampaign = function (campaign) {
            $state.go("tabs.campaign", {campaign_name: campaign.campaign_name, campaign_id: campaign.campaign_id,	campaign_description: campaign.description,
			imagine: campaign.imagine, creation_date: campaign.creation_date, administrator: campaign.administrator});
        };
    }
}]);
