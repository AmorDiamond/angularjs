angular.module('ylmf.addUser', [])
	.controller('addUserCtrl',function($http, $scope, mainUrl, $state) {
		$scope.userInfo = {
    		account: '',
    		name: '',
    		password: ''
    	}
    	
    	$scope.addUser = function(){
    		layer.open({
			  type: 1,
			  skin: 'layui-layer-demo', 
			  closeBtn: 0, //不显示关闭按钮
			  anim: 2,
			  shadeClose: false, //开启遮罩关闭
			  content: '<div style="padding:20px">正在创建中。。。</div>'
			});
    		$http({
    			url: mainUrl + '/v1/operator/',
    			method: 'POST',
    			data : $scope.userInfo
    		}).then(function(res){
    			layer.closeAll();
        		if(res.data.responseCode == '_200'){
	        		layer.msg('添加成功！');
	        		$state.go('me.sysUser');
        		}else{
        			layer.msg(res.data.errorMsg);
        			return;
        		}
        		
    		},function(err){
    			layer.closeAll();
    			console.log(err)
    			layer.msg(err.data.message);
    		})
    	}
		
	});