angular.module('amor.echarts',[]).controller('echartsCtrl',function ($scope) {
  console.log(22)
  $scope.myChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      // orient: 'vertical',
      x: 'left',
      data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
      {
        name:'访问来源',
        type:'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:[
          {value:335, name:'直接访问'},
          {value:310, name:'邮件营销'},
          {value:234, name:'联盟广告'},
          {value:135, name:'视频广告'},
          {value:1548, name:'搜索引擎'}
        ]
      }
    ]
  };
}).directive('echarts', function($parse, $interval){
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      options: '=',
      height: '@',
      width: '@'
    },
    link: function(scope, element, attrs, ctrl) {
      var wrap = $('<div></div>').css({
        width: scope.width||'100%',
        height: scope.height||'210'
      });
      $(element).css({
        display:'block',
        width: scope.width||'100%',
        height: scope.height||'210'
      });
      var myChart = echarts.init(element[0]);
      window.addEventListener('resize',function(){
        myChart.resize();//监测图表自适应
      })

      scope.$watch('options', function(n, o){
        if (typeof(n)=='object') {
          myChart.setOption(scope.options);

        };
      });

    }
  };
});