var mApp = angular.module('mApp', []); 
mApp.controller('ctrller', ['$scope', '$http', function($scope, $http) { 

$scope.hip = 45;
    $http.get('pi/').success(function(response){
        $scope.pies = response;
    });

    $http.get('building/').success(function(response){
        $scope.buildings = response;
    });

    
    $scope.selectedBuilding = function(id) {
        $http.get('pi/filterBuilding', {params:{"id": id }}).success(function(response){
            $scope.pies = response;
            $scope.$watch(function() {
                $('.selectpicker').selectpicker('refresh');
            });

        });
    }

}]); 