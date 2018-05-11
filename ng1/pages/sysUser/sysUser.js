angular.module('ylmf.sysUser', ['ylmf.serve', 'ui.bootstrap'])
    .controller('sysUserCtrl', function ($scope, $http, mainUrl, $filter, imgUrl) {
		
    	$scope.userInfo = {
    		account: '',
    		name: '',
    		status: '',
    		page: ''
    	}
        //分页组件的参数
    	$scope.pageParams = {
    		maxSize: 5,
	        totalItems: 0,
	        currentPage: 1,
	        itemsPerPage: 15
    	}
    	/*获取用户列表*/
    	$scope.getSysUser = function(){
    		$scope.userInfo.page = $scope.pageParams.currentPage - 1;
    		console.log($scope.userInfo)
    		$http({
    			url: mainUrl + '/v1/operator/',
    			method: 'GET',
    			params : $scope.userInfo
    		}).then(function(res){
    			console.log(res)
        		if(res.data.responseCode == '_200'){
	        		$scope.useres = res.data.data.content;
	        		$scope.pageParams.totalItems = res.data.data.totalElements;
					$scope.pageParams.itemsPerPage = res.data.data.size;
        		}else{
        			layer.msg(res.data.errorMsg);
        			return;
        		}
        		
        		
    		},function(err){
    			console.log(err)
    			layer.msg(err.data.message);
    		})
    	}
    	/*禁用和启用用户*/
    	$scope.disableUser = function(id,flag){
    		
    		if(flag == 'STATUS_NORMAL'){
    			flag = false;
    			layer.confirm('是否禁用该用户登录?', {icon: 3, title:'提示'}, function(index){
		        	$scope.godisableUser(id,flag);
				});
    		}else{
    			flag = true;
    			layer.confirm('是否启用该用户登录?', {icon: 3, title:'提示'}, function(index){
		        	$scope.godisableUser(id,flag);
				});
    		}
    	}
    	/*改变用户状态*/
    	$scope.godisableUser = function(id,flag){
    		
//    		if(flag == 'STATUS_NORMAL'){
//    			flag = false;
//    		}else{
//    			flag = true;
//    		}
    		$http({
    			url: mainUrl + '/v1/operator/disableOrUsable',
    			method: 'PATCH',
    			params: {operatorId:id,flag:flag}
    		}).then(function(res){
        		if(res.data.responseCode == '_200'){
	        		if(flag){
	        			layer.msg('启用成功！', {
						  icon: 1,
						  time: 1000
						});
	        		}else{
	        			layer.msg('已禁用', {
						  icon: 0,
						  time: 1000 //1秒关闭（如果不配置，默认是3秒）
						});
	        		}
	        		$scope.getSysUser();
        		}else{
        			layer.msg(res.data.errorMsg);
        			return;
        		}
        		
    		},function(err){
    			console.log(err)
    			layer.msg(err.data.message);	
    		})
    	}
    	/*删除用户*/
    	$scope.delUser = function(id){
    		layer.confirm('您确定要删除该用户?', {icon: 3, title:'提示'}, function(index){
		        	$http({
		    			url: mainUrl + '/v1/operator/',
		    			method: 'DELETE',
		    			params: {operatorId:id}
		    		}).then(function(res){
		        		if(res.data.responseCode == '_200'){
			        		layer.msg('删除成功！', {
							  icon: 1,
							  time: 1000
							});
			        	
			        		$scope.getSysUser();
		        		}else{
		        			layer.msg(res.data.errorMsg);
		        			return;
		        		}
		        		
		    		},function(err){
		    			console.log(err)
		    			layer.msg(err.data.message);	
		    		})
				});
    		
    	}
    	
    	
    	$scope.getSysUser();
    	
    	$scope.reset = function(){
    		$scope.userInfo = {
	    		account: '',
	    		name: '',
	    		status: '',
	    		page: ''
	    	}
    	}
		
	});