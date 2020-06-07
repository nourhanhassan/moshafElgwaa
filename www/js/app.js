// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
   
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.save', {
    url: '/save',
    views: {
      'menuContent': {
        templateUrl: 'templates/save.html'
      }
    }
  })
  
  .state('app.save-part2', {
    url: '/save-part2',
    views: {
      'menuContent': {
        templateUrl: 'templates/save-part2.html'
      }
    }
  })

  .state('app.goals', {
    url: '/goals',
    views: {
      'menuContent': {
        templateUrl: 'templates/goals.html'
      }
    }
  })
    .state('app.souar', {
      url: '/souar',
      views: {
        'menuContent': {
          templateUrl: 'templates/souar.html',
        }
      }
    })

  .state('app.parts', {
    url: '/parts',
    views: {
      'menuContent': {
        templateUrl: 'templates/parts.html',
      }
    }
  })
  
  
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })
  .state('app.pages', {
    url: '/pages',
    views: {
      'menuContent': {
        templateUrl: 'templates/pages.html'
      }
    }
  })
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })
  .state('app.bookmarks', {
    url: '/bookmarks',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarks.html'
      }
    }
  })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/souar');
});
