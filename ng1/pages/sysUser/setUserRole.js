angular.module('ylmf.setUserRole', [])
	.controller('setUserRoleCtrl', function($scope, $http, $stateParams, mainUrl, $state) {
		$scope.userId = $stateParams.userId;
		
		/*获取cookie*/
		function getCookie(c_name){
			if (document.cookie.length>0)
			  {
			  c_start=document.cookie.indexOf(c_name + "=")
			  if (c_start!=-1)
			    { 
			    c_start=c_start + c_name.length+1 
			    c_end=document.cookie.indexOf(";",c_start)
			    if (c_end==-1) c_end=document.cookie.length
			    return unescape(document.cookie.substring(c_start,c_end))
			    } 
			  }
			return ""
		};
		
		var operatorId = getCookie('USERID');
		
		
		/*获取当前登录用户所有角色*/
		$http({
			url: mainUrl + '/v1/roles/getRolesByOperator',
			method: 'GET',
			params: {operatorId: operatorId}
		}).then(function(res){
			console.log(res)
			$scope.operatorInfo = res.data.data
			/*查询已绑定的角色*/
			$scope.hasRoles();
		},function(err){
			console.log(err)
			layer.msg(err.data.message)
		})
		
		
		/*获取编辑用户的信息*/
    	$scope.getUserInfo = function() {
    		$http({
    			method: 'get',
    			url: mainUrl + '/v1/operator/getById',
    			params: {operatorId: $scope.userId}
    		}).then(function(res) {
    			$scope.userInfo = res.data.data;
    		}, function(err) {
				layer.msg(err.data.message);
    		})
    	}
    	$scope.getUserInfo();
    	
		/*用来存储所有处理后的角色信息*/
    	$scope.rolesCache = {};
    	
		/*获取编辑用户已有的角色*/
		$scope.hasRoles = function(){
			$http({
				url: mainUrl + '/v1/roles/getRolesByOperator',
				method: 'GET',
				params: {operatorId: $scope.userId}
			}).then(function(res){
				
				$scope.modifyRoleForOperator(res.data.data);
			
			},function(err){
				console.log(err)
				layer.msg(err.data.message)
			})
		}
		
		/*处理用户已经绑定的角色*/
    	$scope.modifyRoleForOperator = function(data) {
			angular.forEach($scope.operatorInfo,function(Item, Index) {
				Item.hasChecked = false;
				angular.forEach(data,function(item, index) {
					if (item.id === Item.id) {
						console.log(Item.id);
						Item.hasChecked = true;
					}
				})
				/*把用户绑定的角色信息储存起来*/
				$scope.rolesCache[Item.id] = Item.hasChecked;
			})
    	}
		 	
    	
    	/*用户与角色进行绑定（一个一个的绑定）*/
    	$scope.bindRoleForOperator = function(roleId) {
    	
    		$http({
    			method: 'post',
    			url: mainUrl + '/v1/security/bindRoleForOperator',
    			params: {
    				roleId: roleId,
    				operatorId: $scope.userId
    			}
    		}).then(function(res) {
    			console.log('绑定成功', res);
    		}, function(err) {
    			console.log(err);
				layer.msg(err.data.message);
    		})
    	}
    	
    	/*用户与角色解绑*/
    	$scope.unbindRoleForOperator = function(roleId) {
    		$http({
    			method: 'post',
    			url: mainUrl + '/v1/security/unbindRoleForOperator',
    			params: {
    				roleId: roleId,
    				agentId: $scope.userId
    			}
    		}).then(function(res) {
				console.log('解绑成功', roleId, res);
    		}, function(err) {
    			console.log('解绑失败', err);
				layer.msg(err.data.message);
    		})
    	}
    	
    	$scope.addUserRole = function() {
    		angular.forEach($scope.operatorInfo,function(item, index) {
    			console.log($scope.rolesCache[item.id])
    			console.log(item.haCheched)
    			if($scope.rolesCache[item.id] !== item.hasChecked) {
    				if (item.hasChecked) {
    					$scope.bindRoleForOperator(item.id);
    				} else {
    					$scope.unbindRoleForOperator(item.id);
    				}
    			}
    		})
    		layer.msg('操作成功');
    		$state.go('me.sysUser');
    	}
    	
	})