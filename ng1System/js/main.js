angular.module('myApp', ['ngAnimate', 'ui.router', 'oc.lazyLoad','ui.bootstrap','ngMessages'])
    //懒加载配置
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true,
            event: false
        });
    }])
    .run(function ($rootScope, $urlRouter) {
        //获取当前地址栏的url
        $rootScope.$on('$locationChangeSuccess', function (evt) {
            //console.log(window.location.href);
            $rootScope.ch = window.location.href;
        });

        $rootScope.returnPage = function () {
            window.history.go(-1);
        }
});