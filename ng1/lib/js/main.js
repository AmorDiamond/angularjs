angular.module('amor', ['ngAnimate', 'ui.router', 'oc.lazyLoad', 'ui.bootstrap','ngMessages','ngFileUpload'])
  .constant('mainUrl', '/operation')
  .constant('imgUrl', '/imageServer')
  .service('layerService', function () {
    this.show = function (title, url, w, h) {
      console.log(title, url, w, h);
      if (title == null || title == '') {
        title=false;
      };
      if (url == null || url == '') {
        url="404.html";
      };
      if (w == null || w == '') {
        w=800;
      };
      if (h == null || h == '') {
        h=($(window).height() - 50);
      };
      layer.open({
        type: 2,
        area: [w+'px', h +'px'],
        fix: false, //不固定
        maxmin: true,
        shade:0.4,
        title: title,
        content: url
      });
    }

  })
    //懒加载配置
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true,
            event: false
        });
    }])
     .factory('UserInterceptor', ["$q","$rootScope",function ($q,$rootScope) {
  	return {

     responseError: function (response) {
       var data = response.data;

   // 如果是登录超时
       console.log(response)
 	  if(response["status"] == "-1"){

 	        $rootScope.$emit("userIntercepted","sessionOut",response);
 	        /*设置cookie*/
 //			function setCookie(c_name,value,expiredays){
 //				var exdate=new Date()
 //				exdate.setDate(exdate.getDate()+expiredays)
 //				document.cookie=c_name+ "=" +escape(value)+
 //				((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
 //			};

 	      }
 	      return $q.reject(response);
 	    }
 	  };
 	}])
 	.factory('permissions', function ($rootScope,$window) {
		var permissionList = [];
		var nopermissionList = [];
		var permissionUsers = [];
//		var permissionList = ['edit','add'];

		return {
			restPermissionList: function(){
				permissionList = [];				
				nopermissionList = [];				
			},
			setPermissions: function(key,permission) {
				
				if(key == 'userPermissions'){
					permissionList.push(permission);
					$window.sessionStorage[key] = permissionList;
				}else{
					nopermissionList.push(permission);
					$window.sessionStorage[key] = nopermissionList;
				}
				
				$rootScope.$broadcast('permissionsChanged')
			},
			hasPermission: function (key,permission) {
				permissionUsers = ($window.sessionStorage[key]).split(",");
					if (permissionUsers.length == 0) {
						return false;
					}
//					for (i = 0; i < permissionUsers.length; i++) {
//						if (permissionUsers[i] == permission) {
//							return true;
//						}
//					}
				return $.inArray(permission, permissionUsers) > -1 ? 1 : 0;
			}
		}
	})
  /*.provider('permissions', function () { 
    var permissionList;
//    this.permissionList = ['edit','add'];
    console.log(this.permissionList)
      this.setPermissions = function(permissions) {  
        permissionList = permissions;  
//        $rootScope.$broadcast('permissionsChanged')  
      };
      this.$get = function(){
      	return{
	      	hasPermission : function (permission) { 
	        permission = permission.trim();  
	
		        return $.inArray(permission, permissionList) > -1 ? 1 : 0;
	      } 
      	} 
      } 
	})
	.config(function (permissionsProvider) {
 	  permissionsProvider.setPermissions(['edit','add']);
 	})*/
 	.directive('hasPermission', function(permissions,$http,mainUrl,$window,$rootScope) {
	  return {  
	    link: function(scope, element, attrs) { 
	    
	      var value = attrs.hasPermission.trim();
	      valueArr = value.split('&');
	      if (!($window.sessionStorage['userPermissions'] == undefined || $window.sessionStorage['userPermissions'] == null)) {
				if(permissions.hasPermission('userPermissions',value)){//判断是否已经存在
					element.show();
			  		return;
			  	}
			}
			if(!($window.sessionStorage['nouserPermissions'] == undefined || $window.sessionStorage['nouserPermissions'] == null)){
				if(permissions.hasPermission('nouserPermissions',value)){//判断是否已经存在
					element.hide();
			  		return;
			  	}
			}
		  	
		  /*获取当前登录用户权限------*/
		  /*$http({
			  url: mainUrl + '/v1/competence/findCompetencePermissionByUrl',
			  method: 'GET',
			  params: {url:valueArr[0],methods:valueArr[1]}
		  }).then(function(res){
			  if(res.data.data == true){
			  	element.show();
			  	
			  	if ($window.sessionStorage['userPermissions'] == undefined || $window.sessionStorage['userPermissions'] == null) {
					permissions.setPermissions('userPermissions',value);
				}else if(permissions.hasPermission('userPermissions',value)){//判断是否已经存在
			  		return;
			  	}else{
			  		permissions.setPermissions('userPermissions',value);
			  	}
			  	
			  }else{
			  	element.hide();
			  	if ($window.sessionStorage['nouserPermissions'] == undefined || $window.sessionStorage['nouserPermissions'] == null) {
					permissions.setPermissions('nouserPermissions',value);
				}else if(permissions.hasPermission('nouserPermissions',value)){//判断是否已经存在
			  		return;
			  	}else{
			  		permissions.setPermissions('nouserPermissions',value);
			  	}
			  }
		  },function(err){
			  console.log(err);
			  layer.msg(err.data.message)
		  })*/
	      
	      
//	      var notPermissionFlag = value[0] === '!';  
//	      if(notPermissionFlag) {  
//	        value = value.slice(1).trim();  
//	      }  
	    
//	      function toggleVisibilityBasedOnPermission() {  
//	        var hasPermission = permissions.hasPermission(value);  
//	      console.log(hasPermission)
//	    
//	        if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)  
//	          element.show();  
//	        else 
//	          element.hide();  
//	      }  
//	      toggleVisibilityBasedOnPermission();  
//	      scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);  
	    }  
	  };  
	})
 	.config(function ($httpProvider) {
 	  $httpProvider.interceptors.push('UserInterceptor');
 	})
    .run(function ($rootScope, $urlRouter, $state,$window,permissions) {
//		$rootScope.userPermissions = [];
    	/*监听自定义服务*/
        $rootScope.$on('userIntercepted',function(errorType){
		  // 跳转到登录界面，这里记录了一个from，这样可以在登录后自动跳转到未登录之前的那个界面
        	setCookie('USERNAME','',-1);
        	setCookie('USERID','',-1);
        	$window.sessionStorage.removeItem('userPermissions');
        	$window.sessionStorage.removeItem('nouserPermissions');
        	/*重置权限列表*/
        	permissions.restPermissionList();
//		  	$state.go('login',{from:$state.current.name,w:'seesionOut'});
		  	$state.go('login');
		});
        //获取当前地址栏的url
        $rootScope.$on('$locationChangeSuccess', function (evt) {
        	if(!getCookie('USERNAME')){
	        	evt.preventDefault();//取消默认跳转行为
	        	$state.go('login');
        	}
        	
            //console.log(window.location.href);
            $rootScope.ch = window.location.href;
            $rootScope.USERNAME = getCookie('USERNAME');
        });
        

        $rootScope.returnPage = function () {
            window.history.go(-1);
        }
        
        
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
		/*设置cookie*/
		function setCookie(c_name,value,expiredays){
			var exdate=new Date()
			exdate.setDate(exdate.getDate()+expiredays)
			document.cookie=c_name+ "=" +escape(value)+
			((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
		};
    });