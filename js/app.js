var js_website = angular.module('js_website', ['ngRoute', 'ngResource', 'jtt_vimeo']);

// CONTROLLERS
js_website.controller('homeController', ['$scope', function($scope) {

    
}]);

js_website.controller('instagramController', ['$scope', '$resource', function($scope, $resource) {
    
    $scope.instagramAPI = $resource("https://api.instagram.com/v1/users/self/media/recent/?access_token=2235700352.4ee6f6e.b902f5c21acc4655a71b7043b21cdcfc", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
    
    $scope.instagramFeed = $scope.instagramAPI.get();
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);
        
    };
    
}]);

js_website.controller('vimeoController', ['$scope', '$resource', '$sce', 'vimeoFactory', function($scope, $resource, $sce, vimeoFactory) {
    $scope.vimeoFeed = [];
    
    $scope.mainVimeoVideo;
    
    vimeoFactory.getVideosFromUser({
        user:"jstshrd",
        access_token:"1bb5838a1c16bdab1e8eac3add1b6f2a"
    }).then(function(_data){
        $scope.vimeoFeedContainer = _data.data.data;
        $scope.filterVimeoFeed();
    }).catch(function (_data) {
        //on error
    });
    
    $scope.SkipValidation = function(value) {
        var n = value.search("player_id=0");
        var vimeoIframe = value.slice(0, n) + 'autoplay=1&loop=1&' + value.slice(n);
        
        return $sce.trustAsHtml(vimeoIframe);
    };
    
    $scope.filterVimeoFeed = function() {
        
        $scope.length = $scope.vimeoFeedContainer.length;
        
        for(i = 0; i < $scope.length; i++) {
            if($scope.vimeoFeedContainer[i].link.includes('main')) {
                $scope.mainVimeoVideo = $scope.vimeoFeedContainer[i].uri;
            }
            if($scope.vimeoFeedContainer[i].name.charAt(0) === "#") {
                $scope.vimeoFeed.push($scope.vimeoFeedContainer[i]);
            }
        }
    };
    
    $scope.getMainVimeoVideo = function() {
        if($scope.mainVimeoVideo) {
            var videoHash = $scope.mainVimeoVideo.slice(8);
            return $sce.trustAsResourceUrl('https://player.vimeo.com/video/' + videoHash + '?api=1&player_id=mainVimeoVideo&badge=0&loop=1');
        }
    };
    
    $scope.getVimeoVideos = function(src) {
        var videoHash = src.slice(8);
        return $sce.trustAsResourceUrl('https://player.vimeo.com/video/' + videoHash + '?badge=0&autopause=1&player_id=0');
    };
    
    
//    have a look at https://github.com/vimeo/player.js
    jQuery(document).ready(function() {
       
        var mainVimeoVideoIframe = document.getElementById('mainVimeoVideo');
        
        Froogaloop(mainVimeoVideoIframe).addEvent('ready', ready);

        function ready(playerID){
            Froogaloop(playerID).api('setVolume', 0);
            Froogaloop(playerID).api("play");
        };
    });

}]);

//// ROUTES
js_website.config(function ($routeProvider) {
   
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'vimeoController'
    })
    
    .when('/latest', {
        templateUrl: 'pages/latest.html',
        controller: 'instagramController'
    })
    
    .when('/videos', {
        templateUrl: 'pages/videos.html',
        controller: 'vimeoController'
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