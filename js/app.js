var js_website = angular.module('js_website', ['ngRoute', 'ngResource', 'jtt_vimeo']);

// CONTROLLERS
js_website.controller('vimeoController', ['$scope', '$resource', '$sce', 'vimeoFactory', function($scope, $resource, $sce, vimeoFactory) {
    
//    $scope.vimeoAPI = $resource("https://api.vimeo.com/me/videos?authorization=bearer+1bb5838a1c16bdab1e8eac3add1b6f2a");
//    
//    $scope.vimeoFeed = $scope.vimeoAPI.get();
    
    $scope.vimeoFeed = [];
    
    vimeoFactory.getVideosFromUser({
        user:"jstshrd",
//        per_page:"<ITEMS_PER_PAGE>", // (optional) valid values: 1-50 | default: 25
//        page:"<PAGE_NUMBER>", // (optional)
//        query:"<QUERY>", // (optional)
//        filter:"<FILTER>", // (optional)
//        filter_embeddable:"<FILTER_EMBEDDABLE>", // (optional)
//        sort:"<SORT>", // (optional)
//        direction:"<DIRECTION>", // (optional)
        access_token:"1bb5838a1c16bdab1e8eac3add1b6f2a"
    }).then(function(_data){
        $scope.vimeoFeedContainer = _data.data.data;
        $scope.filterVimeoFeed();
    }).catch(function (_data) {
        //on error
    });
    
    $scope.SkipValidation = function(value) {
      return $sce.trustAsHtml(value);
    };
    
    $scope.filterVimeoFeed = function() {
        
        $scope.length = $scope.vimeoFeedContainer.length;
        
        for(i = 0; i < $scope.length; i++) {
            console.log(i);
            if($scope.vimeoFeedContainer[i].name.charAt(0) === "#") {
                $scope.vimeoFeed.push($scope.vimeoFeedContainer[i]);
            }
        }
    };
    
    
}]);

js_website.controller('instagramController', ['$scope', '$resource', function($scope, $resource) {
    
    $scope.instagramAPI = $resource("https://api.instagram.com/v1/users/self/media/recent/?access_token=2235700352.4ee6f6e.b902f5c21acc4655a71b7043b21cdcfc", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
    
    $scope.instagramFeed = $scope.instagramAPI.get();
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);
        
    };
    
}]);

js_website.controller('homeController', ['$scope', function($scope) {
    
}]);


//// ROUTES
//js_website.config(function ($routeProvider) {
//   
//    $routeProvider
//    
//    .when('/', {
//        templateUrl: 'pages/home.html',
//        controller: 'homeController'
//    })
//    
//    .when('/latest', {
//        templateUrl: 'pages/latest.html',
//        controller: 'instagramController'
//    })
//});

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