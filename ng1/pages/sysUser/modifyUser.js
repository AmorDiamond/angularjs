angular.module('ylmf.editUser', [])
	.controller('editUserCtrl', function($scope, $http, mainUrl, imgUrl, $state, $stateParams){
		
		$scope.userId = $stateParams.userId;
		
		$scope.userInfo = {
		  id: '',
		  name: '',
		  password: ''
		}
    	
    	$scope.getUserInfo = function(){
    		$http({
    			url: mainUrl + '/v1/operator/getById',
    			method: 'GET',
    			params : {operatorId: $scope.userId}
    		}).then(function(res){
    			console.log(res)
        		if(res.data.responseCode == '_200'){
	        		$scope.userInfo = res.data.data;
	        		$scope.userInfo.password = '';
        		}else{
        			layer.msg(res.data.errorMsg);
        			return;
        		}
        		
    		},function(err){
    			console.log(err)
    			layer.msg(err.data.message);
    		})
    	}
    	
    	$scope.editUser = function(){
    		layer.open({
			  type: 1,
			  skin: 'layui-layer-demo', 
			  closeBtn: 0, //不显示关闭按钮
			  anim: 2,
			  shadeClose: false, //开启遮罩关闭
			  content: '<div style="padding:20px">正在修改中。。。</div>'
			});
    		$http({
    			url: mainUrl + '/v1/operator/updateOperator',
    			method: 'PATCH',
    			data : $scope.userInfo
    		}).then(function(res){
    			layer.closeAll();
        		if(res.data.responseCode == '_200'){
	        		layer.msg('修改成功！');
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
    	
    	$scope.getUserInfo();

	})