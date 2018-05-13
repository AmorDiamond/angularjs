angular.module('myApp.role',[]).controller('roleCtrl',function ($scope,$uibModal) {
	$scope.name="nnnnnnn"
	console.log(1212)
	$("#jstree_demo_div").jstree({
			"plugins" : ['contextmenu', 'types', "search" ],
			'core':{
				'data' : [
					{ "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
					{ "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
					{ "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
					{ "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
					{ "id" : "ajson33", "parent" : "#", "text" : "Child 111" },
					{ "id" : "5", "parent" : "ajson2", "text" : "Child 5" },
					{ "id" : "6", "parent" : "ajson2", "text" : "Child 6" },
				]
			},
			"contextmenu" : {
				items : { // 字典编辑按钮，node参数为弹出菜单对应的item,node.reference为a标签
					create : {
						label : "添加", // 显示名称
						icon : "fa fa-sign-in", // 图标
						_disabled : function(node) { // 是否可以点击
							var tree = $.jstree.reference("#jstree_demo_div");
							var id = tree.get_selected()[0];
							var type = tree.get_type(id);
							console.log(id,type)
							if (type == "commodityAttrValue") {
								return true;
							}
						},
						action : function() { // 点击事件执行的函数
							dictCreateAndEdit("create");
						}
					},
					edit : {
						label : "编辑",
						icon : "fa fa-pencil",
						action : function() {
							dictCreateAndEdit("edit");
						},
						separator_after : true
						// 后面添加分割线
					},
					disable : {
						label : "禁用",
						icon : "fa fa-minus-circle",
						_disabled : function(node) { // 是否可以点击
							return node.reference.attr("disable") == 'true';
						},
						action : function() {
							disableAndUsable("disable");
						}
					},
					enable : {
						label : "启用",
						icon : "fa fa-check-square-o",
						_disabled : function(node) {
							return node.reference.attr("disable") == 'false';
						},
						action : function() {
							disableAndUsable("usable");
						}
					},
					del : {
						label : "删除",
						icon : "fa fa-close",
						action : function() {
							del();
						},
						separator_after : true
					}
				}
			}
		}
	);

	/*用于plugins搜索的实现*/
	var to = false;
	$('#plugins4_q').keyup(function () {
		if(to) { clearTimeout(to); }
		to = setTimeout(function () {
			var v = $('#plugins4_q').val();
			$('#jstree_demo_div').jstree(true).search(v);
		}, 250);
	});
// 添加编辑字典
		var addOrEditModalUrl = {
//				html : "views/category/categoryDictCreateEdit.html",
//				js : "views/category/categoryDictCreateEdit.js",
			ctrl : {
				create : "categoryDictCreateCtrl",
				edit : "categoryDictEditCtrl"
			}
		};
		function dictCreateAndEdit(flag) {
			var tree = $.jstree.reference("#jstree_demo_div");
			var id = tree.get_selected()[0]; // 当前选中节点id
//				if (flag == "edit" && id == 1) {
//					layer.msg("不能修改根目录");
//					return;
//				}
			$uibModal.open({
				animation : true, // 动画
				backdrop : true, // 背景
				backdropClass : 'modal_bg', // 背景class
				windowClass : 'modal_container', // modal容器class
				size : 'md',
				templateUrl : 'myModalContent.html',
				controller : addOrEditModalUrl.ctrl[flag],
				resolve : {
//								load : $ocLazyLoad.load(addOrEditModalUrl.js),
					id : function() {
						return id;
					}
				}
			}).result.then(function(result) {
				$('#jstree_demo_div').jstree().refresh();
			}, function(result) {
			});
		};

		// 禁用启用
		var statusChangeUrls = {
			disable : {
				//url : mainUrl + "/v1/mapTree/disable",
				msg : "禁用成功"
			},
			usable : {
				//url : mainUrl + "/v1/mapTree/enable",
				msg : "启用成功"
			}
		};
		function disableAndUsable(flag) {
			var tree = $.jstree.reference("#jstree_demo_div");
			var id = tree.get_selected()[0]; // 当前选中节点id
			if (flag == "disable" && id == 1) {
				layer.msg("不能禁用根目录");
				return;
			}
			var changeUrl = statusChangeUrls[flag];
			layer.load();
			$http({
				method : 'post',
				url : changeUrl.url,
				params : {
					"id" : id
				}
			}).then(function(response) {
				if (response.status != 200) {
					return;
				}
				layer.closeAll('loading');
				var result = response.data;
				layer.msg(changeUrl.msg);
				var currentNode = tree.get_node(null, false);
				var parentNode = tree.get_parent(currentNode);
				tree.refresh(parentNode);
			}, function(response) {
				layer.closeAll('loading');
				layer.msg(response.data.message, {
					icon : 2
				});
			});
		};

		// 删除字典
		function del() {
			var msg = "码表信息"
			var tree = $.jstree.reference("#jstree_demo_div");
			var id = tree.get_selected()[0];
			var type = tree.get_type(id);
			if (type == "commodityAttrName") {
				msg = "商品属性"
			} else if (type == "commodityAttrValue") {
				msg = "商品属性值"
			}
			layer.confirm("是否删除该" + msg + "?", function(index) {
				delSubmit()
				layer.close(index);
			});
		};
		function delSubmit() {
			var tree = $.jstree.reference("#jstree_demo_div");
			var id = tree.get_selected()[0]; // 当前选中节点id
			if (id == 1) {
				layer.msg("不能删除根目录");
				return;
			}
			layer.load();
			$http({
				method : 'POST',
				url : mainUrl + "/v1/mapTree/delete",
				params : {
					"id" : id
				}
			}).then(function(response) {
				if (response.status != 200) {
					return;
				}
				layer.closeAll('loading');
				var result = response.data;
				var currentNode = tree.get_node(null, false);
				var parentNode = tree.get_parent(currentNode);
				tree.refresh(parentNode);
			}, function(response) {
				layer.closeAll('loading');
				layer.msg(response.data.message, {
					icon : 2
				});
			});
		}
	})//弹窗的控制器
	.controller('categoryDictEditCtrl',function($scope, $http, $uibModalInstance, id){
		$scope.id = id;
		$scope.codeInfo = {};



		//修改码表
		$scope.modifyCategory = function() {



		}


		$scope.reader = new FileReader();   //创建一个FileReader接口
		$scope.imgPath = '';      //用于存放图片的base64

		$scope.img_upload = function(files) {       //单次提交图片的函数
			if(files){
				if ( typeof(FileReader) === 'undefined' ){
					layer.msg('抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！');
				} else {

					$scope.imgFile = files;
					//			        $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
					$scope.reader.readAsDataURL(files);  //FileReader的方法，把图片转成base64
					$scope.reader.onload = function(ev) {
						$scope.$apply(function(){
							$scope.imgPath = ev.target.result //接收base64
						});
					};
				}
			}
		}

		$scope.ok = function () {
			$scope.modifyCategory();
			$uibModalInstance.close($scope.id + 'categoryDictEditCtrl');
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss(0);
		};
	})
	.controller('categoryDictCreateCtrl', function($scope, $http, $uibModalInstance, id){
		$scope.id = id;
		$scope.codeInfo = {
			coverPath: '',
			introduction: '',
			id: '',
			name: '',
			rule: '',
			parent: {
				id: $scope.id
			}
		};



		//新增码表
		$scope.creatCreateCategory = function() {

		}


		$scope.reader = new FileReader();   //创建一个FileReader接口
		$scope.imgPath = '';      //用于存放图片的base64

		$scope.img_upload = function(files) {       //单次提交图片的函数
			if(files){
				if ( typeof(FileReader) === 'undefined' ){
					layer.msg('抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！');
				} else {

					$scope.imgFile = files;
					//			        $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
					$scope.reader.readAsDataURL(files);  //FileReader的方法，把图片转成base64
					$scope.reader.onload = function(ev) {
						$scope.$apply(function(){
							$scope.imgPath = ev.target.result //接收base64
						});
					};
				}
			}
		}

		$scope.ok = function () {
			$scope.creatCreateCategory();
			$uibModalInstance.close(true);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss(0);
		};

	})