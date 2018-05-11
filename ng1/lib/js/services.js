angular.module('ylmf.serve',[])
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

    }).value('uiSelect2Config', {}).directive('uiSelect2', ['uiSelect2Config', '$timeout', function (uiSelect2Config, $timeout) {
  var options = {};
  if (uiSelect2Config) {
    angular.extend(options, uiSelect2Config);
  }
  return {
    require: 'ngModel',
    priority: 1,
    compile: function (tElm, tAttrs) {
      var watch,
        repeatOption,
        repeatAttr,
        isSelect = tElm.is('select'),
        isMultiple = angular.isDefined(tAttrs.multiple);

      // Enable watching of the options dataset if in use
      if (tElm.is('select')) {
        repeatOption = tElm.find( 'optgroup[ng-repeat], optgroup[data-ng-repeat], option[ng-repeat], option[data-ng-repeat]');

        if (repeatOption.length) {
          repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
          watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
        }
      }

      return function (scope, elm, attrs, controller) {
        // instance-specific options
        var opts = angular.extend({}, options, scope.$eval(attrs.uiSelect2));

        /*
        Convert from Select2 view-model to Angular view-model.
        */
        var convertToAngularModel = function(select2_data) {
          var model;
          if (opts.simple_tags) {
            model = [];
            angular.forEach(select2_data, function(value, index) {
              model.push(value.id);
            });
          } else {
            model = select2_data;
          }
          return model;
        };

        /*
        Convert from Angular view-model to Select2 view-model.
        */
        var convertToSelect2Model = function(angular_data) {
          var model = [];
          if (!angular_data) {
            return model;
          }

          if (opts.simple_tags) {
            model = [];
            angular.forEach(
              angular_data,
              function(value, index) {
                model.push({'id': value, 'text': value});
              });
          } else {
            model = angular_data;
          }
          return model;
        };

        if (isSelect) {
          // Use <select multiple> instead
          delete opts.multiple;
          delete opts.initSelection;
        } else if (isMultiple) {
          opts.multiple = true;
        }

        if (controller) {
          // Watch the model for programmatic changes
           scope.$watch(tAttrs.ngModel, function(current, old) {
            if (!current) {
              return;
            }
            if (current === old) {
              return;
            }
            controller.$render();
          }, true);
          controller.$render = function () {
            if (isSelect) {
              elm.select2('val', controller.$viewValue);
            } else {
              if (opts.multiple) {
                controller.$isEmpty = function (value) {
                  return !value || value.length === 0;
                };
                var viewValue = controller.$viewValue;
                if (angular.isString(viewValue)) {
                  viewValue = viewValue.split(',');
                }
                elm.select2(
                  'data', convertToSelect2Model(viewValue));
                if (opts.sortable) {
                  elm.select2("container").find("ul.select2-choices").sortable({
                    containment: 'parent',
                    start: function () {
                      elm.select2("onSortStart");
                    },
                    update: function () {
                      elm.select2("onSortEnd");
                      elm.trigger('change');
                    }
                  });
                }                  
              } else {
                if (angular.isObject(controller.$viewValue)) {
                  elm.select2('data', controller.$viewValue);
                } else if (!controller.$viewValue) {
                  elm.select2('data', null);
                } else {
                  elm.select2('val', controller.$viewValue);
                }
              }
            }
          };

          // Watch the options dataset for changes
          if (watch) {
            scope.$watch(watch, function (newVal, oldVal, scope) {
              if (angular.equals(newVal, oldVal)) {
                return;
              }
              // Delayed so that the options have time to be rendered
              $timeout(function () {
                elm.select2('val', controller.$viewValue);
                // Refresh angular to remove the superfluous option
                controller.$render();
                if(newVal && !oldVal && controller.$setPristine) {
                  controller.$setPristine(true);
                }
              });
            });
          }

          // Update valid and dirty statuses
          controller.$parsers.push(function (value) {
            var div = elm.prev();
            div
              .toggleClass('ng-invalid', !controller.$valid)
              .toggleClass('ng-valid', controller.$valid)
              .toggleClass('ng-invalid-required', !controller.$valid)
              .toggleClass('ng-valid-required', controller.$valid)
              .toggleClass('ng-dirty', controller.$dirty)
              .toggleClass('ng-pristine', controller.$pristine);
            return value;
          });

          if (!isSelect) {
            // Set the view and model value and update the angular template manually for the ajax/multiple select2.
            elm.bind("change", function (e) {
              e.stopImmediatePropagation();
              
              if (scope.$$phase || scope.$root.$$phase) {
                return;
              }
              scope.$apply(function () {
                controller.$setViewValue(
                  convertToAngularModel(elm.select2('data')));
              });
            });

            if (opts.initSelection) {
              var initSelection = opts.initSelection;
              opts.initSelection = function (element, callback) {
                initSelection(element, function (value) {
                  var isPristine = controller.$pristine;
                  controller.$setViewValue(convertToAngularModel(value));
                  callback(value);
                  if (isPristine) {
                    controller.$setPristine();
                  }
                  elm.prev().toggleClass('ng-pristine', controller.$pristine);
                });
              };
            }
          }
        }

        elm.bind("$destroy", function() {
          elm.select2("destroy");
        });

        attrs.$observe('disabled', function (value) {
          elm.select2('enable', !value);
        });

        attrs.$observe('readonly', function (value) {
          elm.select2('readonly', !!value);
        });

        if (attrs.ngMultiple) {
          scope.$watch(attrs.ngMultiple, function(newVal) {
            attrs.$set('multiple', !!newVal);
            elm.select2(opts);
          });
        }

        // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
        $timeout(function () {
          elm.select2(opts);

          // Set initial value - I'm not sure about this but it seems to need to be there
          elm.select2('data', controller.$modelValue);
          // important!
          controller.$render();

          // Not sure if I should just check for !isSelect OR if I should check for 'tags' key
          if (!opts.initSelection && !isSelect) {
              var isPristine = controller.$pristine;
              controller.$pristine = false;
              controller.$setViewValue(
                  convertToAngularModel(elm.select2('data'))
              );
              if (isPristine) {
                  controller.$setPristine();
              }
            elm.prev().toggleClass('ng-pristine', controller.$pristine);
          }
        });
      };
    }
  };
}])// 自定义指令
.directive("jsTree", function($window) {
			return {
				restrict : 'A',
				scope : {
					jstree : '=',
					whetherJsTree : '='
				},
				link : function(scope, element, attrs) {
					// scope.$watch('jstree', function() {
					
					/*申请二维码的地区数据*/
					if(attrs.type == 'channelTree'){
						/*13515为地区数据的根ID*/
						var typeId = '13515';
					}
					/*申请二维码的渠道数据*/
					if(attrs.type == 'areaTree'){
						/*13514为渠道数据的根ID*/
						var typeId = '13514';
					}
					/*13525为网点管理的根ID*/
					var treeId = typeId ? typeId : '13525';
					$(element).jstree({
						core : {
							multiple : false,
							'data' : {
								'url' : scope.jstree.dataUrl,
								'async' : true,
								'data' : function(node) {
									return {
										'id' : $(node).attr("id") == "#"
												? treeId
												: $(node).attr("id"),
										includeDisable:"false"
									};
								},

								lang : {
									loading : "目录加载中……"
								}
							},
							force_text : false,
							check_callback : true
						},
						'expand_selected_onload' : true, // 选中项蓝色底显示
						'checkbox' : {
							// 禁用级联选中
							'three_state' : false,
							'cascade' : 'undetermined' // 有三个选项，up, down,
							// undetermined;
							// 使用前需要先禁用three_state
						},
						types : scope.jstree.types,
						/* plugins : [ "contextmenu" ,"state"], */
						plugins : scope.jstree.plugins
					}, false);
					// }, true);
					// select a node
					element.bind("dblclick.jstree", function(e, data) {
						console.log(e)
						console.log(data)
								var id = $(event.target).attr("id");
								var name = $(event.target).attr("name");
								var rule = $(event.target).attr("rule");
								var closeClick;
								console.log(id);
								scope.$apply(function() {
									
											if (id != undefined && id != null) {
												(scope.jstree.id) = (id);
												console.log(scope.jstree);
												closeClick = true;
											}
											if (name != undefined && id != null) {
												(scope.jstree.name) = (name);
											}
											
											if (rule != undefined && id != null && scope.jstree.rule != undefined) {
												(scope.jstree.rule) = (rule);
											}
											

										});
										if(closeClick){
											$('.closeTree').click();
										};
										
							});
					element.bind("loaded.jstree", function(e, data) {
								var node = $(element).jstree("get_node",
										scope.jstree.id);

							});
				}
			};
		});
