angular.module('ylmf.nav', [])
    .controller('navCtrl', function ($scope) {
        //判断显示的二级菜单
        $scope.currentNav = "";
        $scope.selectedNav = function (n) {
            if (n != '' || n != undefined) {
                if (n == $scope.currentNav) {
                    $scope.currentNav = '';
                } else {
                    $scope.currentNav = n;
                }
            }
            localStorage.clear();
        };
        //根据地址栏的url设置当前链接的active
        $scope.hasActive = function (a, b) {
            //a 地址栏的链接地址
            //b 当前页面的url名称，跟state里面的url一致
            var cu_href = a.split('#!/')[1];
            var cu_hrefS = cu_href.split('/');
            //判断当前地址栏是否包含b,这样在进入下一级页面还可以保证菜单栏选中的样式
            if (cu_hrefS.indexOf(b) >= 0) {
                return 'active';
            } else {
                return '';
            }
        };
    });