var mApp = angular.module('mApp', []); 
mApp.controller('ctrller', ['$scope', '$http', function($scope, $http) { 

    $http.get('pi/').success(function(response){
        $scope.pies = response;
    });

    $http.get('building/').success(function(response){
        $scope.buildings = response;
    });

    $scope.selectedBuilding = function(id) {
        //alert("cliffs" + id);
        //Your logic    , {params:{"param1": val1, "param2": val2}}
        $http.get('pi/filterBuilding', {params:{"id": id }}).success(function(response){
            alert("cliffs       " + response);
            $scope.pies = response;
        });
    }

}]); 