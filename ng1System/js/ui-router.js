
angular.module('myApp', ['ngAnimate', 'ui.router', 'oc.lazyLoad','ui.bootstrap','ngMessages'])

//    路由
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'tpls/login.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['tpls/login.css', 'tpls/login.js'])
                    }]
                },
                controller: 'loginCtrl'
            })
            .state('me', {
                url: '/',
                views: {
                    '': {
                        templateUrl: 'home.html'
                    },
                    'header@me': {
                        templateUrl: 'tpls/header.html'
                    },
                    'nav@me': {
                        templateUrl: 'tpls/sidebar.html',
                        resolve: {
                            loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(['tpls/nav.js'])
                            }]
                        },
                        controller: 'navCtrl'
                    }
                }
            })
            .state('me.home', {
                url: 'home',
                views: {
                    'container@me': {
                        templateUrl: 'tpls/first.html',
                        resolve: {
                            loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(['tpls/first.js'])
                            }]
                         },
                         controller: 'homeCtrl'
                    }
                }
            })
            .state('me.user', {
                url: 'user',
                views: {
                    'container@me': {
                        templateUrl: 'tpls/test.html',
                        resolve: {
                            loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(['tpls/userManager.js'])
                            }]
                         },
                         controller: 'userCtrl'
                    }
                }
            })
            .state('me.role', {
                url: 'role',
                views: {
                    'container@me': {
                        templateUrl: 'tpls/role.html',
                        resolve: {
                            loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(['tpls/role.js'])
                            }]
                         },
                         controller: 'roleCtrl'
                    }
                }
            })
            .state('me.menu', {
                url: 'user/menu',
                views: {
                    'container@me': {
                        templateUrl: 'tpls/role.html',
                        resolve: {
                            loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(['tpls/role.js'])
                            }]
                         },
                         controller: 'roleCtrl'
                    }
                }
            });
        
        $urlRouterProvider.otherwise("/login")
});