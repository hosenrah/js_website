var js_website = angular.module('js_website', ['ngRoute', 'ngResource']);

// CONTROLLERS
js_website.controller('instagramController', ['$scope', '$resource', function($scope, $resource) {
    
    $scope.instagramAPI = $resource("https://api.instagram.com/v1/users/self/media/recent/?access_token=2235700352.4ee6f6e.b902f5c21acc4655a71b7043b21cdcfc", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
    
    $scope.instagramFeed = $scope.instagramAPI.get();
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);
        
    };
    
}]);

js_website.controller('homeController', ['$scope', function($scope) {
    
}]);


// ROUTES
js_website.config(function ($routeProvider) {
   
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })
    
    .when('/latest', {
        templateUrl: 'pages/latest.html',
        controller: 'instagramController'
    })
});

// DIRECTIVES
js_website.directive("instagramPost", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/instagramPost.html',
       replace: true,
       scope: {
           post: "=",
           convertToDate: "&",
           dateFormat: "@"
       }
   }
});