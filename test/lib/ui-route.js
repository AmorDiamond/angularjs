angular.module('myApp', ['ui.router', 'oc.lazyLoad'])
.config(function($stateProvider, $urlRouterProvider) {
  var layout = {
    name: '',
    url: '/',
    // templateUrl: '../pages/layout/index.html',
    views: {
      '': {
        templateUrl: './pages/layout/index.html'
      },
      'nav@me': {
        templateUrl: './pages/layout/nav.html'
      }
    }
  };
  var home = {
    name: 'home',
    url: 'home',
    views: {
      'container@me': { //在state为me的配置里面找到ui-view="container"的出口
        templateUrl: './pages/home/home.html',
        resolve: {
          loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad
              .load(['./pages/home/home.js'])
          }]
        },
        controller: 'homeCtrl'
      }
    },
    /*lazyLoad: function ($transition$) {
      return $transition$.injector().get('$ocLazyLoad').load('../pages/home/home.js');
    }*/
  };
  var list = {
    name: 'list',
    url: '/list',
    templateUrl: './pages/list/list.html'
  };
  var notPage = {
    name: 'notPage',
    url: '/404',
    template: '404'
  };
  $stateProvider.state('me', layout)
    .state('me.home', home)
    .state('list', list)
    .state('notPage', notPage);
  $urlRouterProvider.otherwise('home')
});