angular.module('amor')

//    路由
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('me', {
                url: '/',
                views: {
                    '': {
                        templateUrl: 'layout/framework.html'
                    },
                    'header@me': {
                        templateUrl: 'layout/header.html'
                    },
                    'nav@me': {
                        templateUrl: 'layout/nav.html',
                        resolve: {
                            loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(/*['js/nav.js'], {insertBefore: '#mainJs'}*/)
                            }]
                        },
                        // controller: 'navCtrl'
                    }
                }
            })
            /*.state('echarts', {
              url: '/echarts',
                templateUrl: 'pages/echarts/echarts.html',
                resolve: {
                  loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad
                      .load(['pages/echarts/echarts.css', 'pages/echarts/echarts.js'])
                  }]
                },
                controller: 'echartsCtrl'
            })*/
            .state('me.echarts', {
              url: 'echarts',
              views: {
                'contents@me': {
                  templateUrl: 'pages/echarts/echarts.html',
                  resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad
                        .load(['pages/echarts/echarts.js', 'pages/echarts/echarts.css'])
                    }]
                  },
                  controller: 'echartsCtrl'
                }
              }
            })
            /*.state('map', {
              url: '/map',
              templateUrl: 'pages/map/map.html',
              resolve: {
                loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad
                    .load(['pages/map/map.css', 'pages/map/map.js'])
                }]
              },
              controller: 'mapCtrl'
            })*/
            .state('me.map', {
              url: 'map',
              views: {
                'contents@me': {
                  templateUrl: 'pages/map/map.html',
                  resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['pages/map/map.css', 'pages/map/map.js'])
                    }]
                  },
                  controller: 'mapCtrl'
                }
              }
            })
          .state('me.sysUser', {
            url: 'sysUser/sysUser',
            views: {
              'contents@me': {
                templateUrl: 'pages/sysUser/sysUser.html',
                resolve: {
                  loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad){
                    return $ocLazyLoad
                      .load(['pages/sysUser/sysUser.js', 'pages/sysUser/sysUser.css'])
                  }]
                },
                controller: 'sysUserCtrl'
              }
            }
          })
          /*.state('login', {
            url: '/login',
            templateUrl: 'views/login/login.html',
            resolve: {
              loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad
                  .load(['views/login/login.css', 'views/login/login.js'])
              }]
            },
            controller: 'loginCtrl'
          })
          .state('loginOut', {
            url: '/login/:flag',
            templateUrl: 'views/login/login.html',
            resolve: {
              loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad
                  .load(['views/login/login.css', 'views/login/login.js'])
              }]
            },
            controller: 'loginCtrl'
          })
          .state('me.sysUser', {
            url: 'sysUser/sysUser',
            views: {
              'contents@me': {
                templateUrl: 'views/sysUser/sysUser.html',
                resolve: {
                  loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad){
                    return $ocLazyLoad
                      .load(['views/sysUser/sysUser.js', 'views/sysUser/sysUser.css'])
                  }]
                },
                controller: 'sysUserCtrl'
              }
            }
          })*/
        ;
        $urlRouterProvider.otherwise("/login")
    });
