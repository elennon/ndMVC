var mApp = angular.module('mApp', []); 
mApp.controller('ctrller', ['$scope', '$http', function($scope, $http) { 
    $http.get('reading/count').success(function(response){
        $scope.count = response;
    });
    $http.get('reading/time').success(function(response){
        $scope.time = response;
    });
    $http.get('reading/weather').success(function(response){
        $scope.weather = response;
    });
    $http.get('reading/time').success(function(response){
        $scope.time = response;
    });
}]); 