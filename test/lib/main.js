angular.module('myApp', ['ui.router', 'oc.lazyLoad'])
//懒加载配置
  .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
      debug: true,
      event: false
    });
  }]);