angular.module('edec').controller("BarCode", ['$scope', '$cordovaBarcodeScanner', '$state', function ($scope, $cordovaBarcodeScanner, $state) {
    $scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {
            $state.go("tabs.product", { 'ok': 'ok', 'barcode': imageData.text }, {reload: true});
        }, function (error) {
            $state.go("tabs.product");
        });
    };
}]);