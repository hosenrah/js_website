var js_website = angular.module('js_website', ['ngRoute', 'ngResource', 'jtt_vimeo']);

// CONTROLLERS
js_website.controller('homeController', ['$scope', function($scope) {

    
}]);

js_website.controller('instagramController', ['$scope', '$resource', function($scope, $resource) {
    
    $scope.instagramAPI = $resource("https://api.instagram.com/v1/users/self/media/recent/?access_token=2235700352.4ee6f6e.b902f5c21acc4655a71b7043b21cdcfc", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
    
    $scope.instagramAPI.get().$promise.then(function(data) {
            $scope.filterInstaFeeds(data);
//            console.log(data);
        }, function(error) {
            // error handler
        });
    
    $scope.filterInstaFeeds = function(data) {
//         max is 20
        let instaFeedLength = 6;
        $scope.instagramFeed = JSON.parse(JSON.stringify(data.data));
        $scope.instagramFeed.length = instaFeedLength; 
        $scope.resizeInstaFeedBackground(instaFeedLength);
    };
    
    $scope.resizeInstaFeedBackground = function(instaFeedLength) {
        //         resize background image to fit insta feed
        minHeight = Math.ceil(instaFeedLength / 3) * 30 + 10.3;
        $('#latestBackgroundImage').css('min-height', minHeight + 'rem');
    };
    
    $scope.filterInstagramPosts = function(post) {
//        console.log(post);
        return post.images.standard_resolution.url;
    };
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);
        
    };
    
}]);

js_website.controller('vimeoController', ['$scope', '$resource', '$sce', 'vimeoFactory', function($scope, $resource, $sce, vimeoFactory) {
    $scope.vimeoFeed = [];
    $scope.vimeoFeedTutorial = [];
    
    $scope.mainVimeoVideo;
    
    vimeoFactory.getVideosFromUser({
        user:"jstshrd",
        access_token:"1bb5838a1c16bdab1e8eac3add1b6f2a"
    }).then(function(_data){
        $scope.vimeoFeedContainer = _data.data.data;
        $scope.filterVimeoFeedContainer();
    }).catch(function (_data) {
        //on error
    });
    
    $scope.SkipValidation = function(value) {
        var n = value.search("player_id=0");
        var vimeoIframe = value.slice(0, n) + 'autoplay=1&loop=1&' + value.slice(n);
        
        return $sce.trustAsHtml(vimeoIframe);
    };
    
    $scope.filterVimeoFeedContainer = function() {
        $scope.length = $scope.vimeoFeedContainer.length;
        for(i = 0; i < $scope.length; i++) {
            if($scope.vimeoFeedContainer[i].link.includes('main')) {
                $scope.mainVimeoVideo = $scope.vimeoFeedContainer[i].uri;
            }
            if($scope.vimeoFeedContainer[i].name.charAt(0) === "#") {
                $scope.vimeoFeed.push($scope.vimeoFeedContainer[i]);
            }
            if($scope.vimeoFeedContainer[i].name.charAt(0) === "$") {
                $scope.vimeoFeedTutorial.push($scope.vimeoFeedContainer[i]);
            }
        }
        $scope.resizeVimeoFeedBackground($scope.vimeoFeed.length);
        $scope.resizeVimeoTutorialFeedBackground($scope.vimeoFeedTutorial.length);
    };
    
    $scope.resizeVimeoFeedBackground = function(vimeoFeedLength) {
        //         resize background image to fit insta feed
        minHeight = Math.ceil(vimeoFeedLength / 2) * 21.5 + 10.3;
        $('#videoBackgroundImage').css('min-height', minHeight + 'rem');
    };
    
    $scope.resizeVimeoTutorialFeedBackground = function(vimeoTutorialFeedLength) {
        //         resize background image to fit insta feed
        minHeight = Math.ceil(vimeoTutorialFeedLength / 2) * 21.5 + 10.3;
        $('#videoTutorialBackgroundImage').css('min-height', minHeight + 'rem');
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
    $(document).ready(function() {
        $scope.resizeMainVideo();
        
        // auto play of main video
        var mainVimeoVideoIframe = document.getElementById('mainVimeoVideo');

        Froogaloop(mainVimeoVideoIframe).addEvent('ready', ready);
        function ready(playerID){
            Froogaloop(playerID).api('setVolume', 0);
            Froogaloop(playerID).api("play");
        };
    });
    
    $(window).on('resize', function(){
        $scope.resizeMainVideo();
    });
    
    $scope.resizeMainVideo = function() {
        // set main video height equals to screen height on desktop devices, CHANGE ALSO IN CSS!
        var mainVimeoVideoContainer = $('#mainVimeoVideoContainer');
        if($(window).width() >= 1366) {
            mainVimeoVideoContainer.height($(window).height());
        }
    }

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