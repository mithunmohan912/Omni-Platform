angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/ocInfra/templates/components/backend-error-display.html',
    "<!-- Backend error display -->\r" +
    "\n" +
    "<i ng-if=\"field.property.statusMessages.errorCount > 0 || field.property.statusMessages.information.length > 0\" class=\"backend-status fa fa-lg\" ng-class=\"(field.property.statusMessages.errorCount > 0) ? 'fa-exclamation-circle color-error': 'fa-info-circle color-info'\"></i>\r" +
    "\n" +
    "<div ng-if=\"field.property.statusMessages.errorCount > 0 || field.property.statusMessages.information.length > 0\" class=\"arrow_box\">\r" +
    "\n" +
    "	<i class=\"fa fa-exclamation-circle status-message color-error\" ng-repeat=\"msg in field.property.statusMessages.error\"><span>{{ msg.message }}<span></i>\r" +
    "\n" +
    "	<i class=\"fa fa-exclamation-triangle status-message color-warning\" ng-repeat=\"msg in field.property.statusMessages.warning\"><span>{{ msg.message }}<span></i>\r" +
    "\n" +
    "	<i class=\"fa fa-info-circle status-message color-info\" ng-repeat=\"msg in field.property.statusMessages.information\"><span>{{ msg.message }}<span></i>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- End backend error display -->"
  );


  $templateCache.put('src/ocInfra/templates/components/help-tooltip-display.html',
    "<!-- Tooltip display -->\r" +
    "\n" +
    "<i class=\"help-tooltip fa fa-lg fa-question-circle color-info'\"></i>\r" +
    "\n" +
    "<div>\r" +
    "\n" +
    "	<span>{{ field.tooltip | translate }}<span>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<!-- End tooltip display -->"
  );


  $templateCache.put('src/ocInfra/templates/components/input-autocomplete.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-if=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input	type=\"text\"\r" +
    "\n" +
    "				class=\"form-control\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "				maxlength=\"{{field.attributes.maxlength}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur();field.options._typeaheadBlur($event, field)\"\r" +
    "\n" +
    "				ng-focus=\"field.options._typeaheadFocus($event, field)\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				uib-typeahead=\"obj.title for obj in field.options._getData($viewValue, field.id, field)\"\r" +
    "\n" +
    "				typeahead-on-select=\"field.options._select($item, field.id, field)\"\r" +
    "\n" +
    "				typeahead-focus-first=\"field.attributes['typeahead-focus-first']\"\r" +
    "\n" +
    "				typeahead-min-length=\"field.attributes['typeahead-min-length']\"\r" +
    "\n" +
    "				typeahead-wait-ms=\"field.attributes['typeahead-wait-ms']\"\r" +
    "\n" +
    "				\r" +
    "\n" +
    "				capitalize=\"{{field.attributes.capitalize}}\"/>\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!--\r" +
    "\n" +
    "	TODO:\r" +
    "\n" +
    "		ng-keydown\r" +
    "\n" +
    "		typeahead promise\r" +
    "\n" +
    "-->"
  );


  $templateCache.put('src/ocInfra/templates/components/input-checkbox.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-8 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-2 col-sm-offset-2' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input 	type=\"checkbox\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-date.html',
    "<span class=\"form-group has-feedback\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "	\r" +
    "\n" +
    "			<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "			<input  class=\"form-control\"\r" +
    "\n" +
    "					autocomplete=\"off\"\r" +
    "\n" +
    "					id=\"{{field.id}}\"\r" +
    "\n" +
    "					name=\"{{field.name}}\"\r" +
    "\n" +
    "					placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "					ng-model=\"field.property.value\"\r" +
    "\n" +
    "					ng-required=\"field.property.required\"\r" +
    "\n" +
    "					ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "					ng-change=\"field.onChange()\"\r" +
    "\n" +
    "					ng-blur=\"field.onBlur()\"\r" +
    "\n" +
    "					ng-class=\"(!field.label && field.property.required) ? 'required-star' : ''\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "					bs-datepicker\r" +
    "\n" +
    "					autoclose=\"{{field.attributes.autoclose}}\"\r" +
    "\n" +
    "					date-format=\"{{field.attributes.dateformat}}\"\r" +
    "\n" +
    "					start-week=\"{{field.attributes.startWeek}}\"\r" +
    "\n" +
    "					trigger=\"{{field.attributes.trigger}}\"\r" +
    "\n" +
    "					format-date />\r" +
    "\n" +
    "			<i class=\"form-control-feedback fa fa-lg fa-calendar\"></i>\r" +
    "\n" +
    "		\r" +
    "\n" +
    "			<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!--\r" +
    "\n" +
    "	TODO: ui-mask similar to dateformat\r" +
    "\n" +
    "-->"
  );


  $templateCache.put('src/ocInfra/templates/components/input-decimal.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input  type=\"text\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				class=\"form-control\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				decimal\r" +
    "\n" +
    "				decimal-precision=\"field.attributes.decimalprecision\"\r" +
    "\n" +
    "				decimal-min=\"field.attributes.minimum\"\r" +
    "\n" +
    "				decimal-max=\"field.attributes.maximum\" />\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-email.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input 	type=\"email\"\r" +
    "\n" +
    "				class=\"form-control\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "				maxlength=\"{{field.attributes.maxlength}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\" />\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-label.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "	\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-{{field.labelsize}} col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"field.label ? 'col-sm-'+(12-field.labelsize): ''\" class=\"col-xs-12\">\r" +
    "\n" +
    "		<span ng-class=\"field.class ? field.class : ''\">\r" +
    "\n" +
    "			<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "			<ng-switch on=\"field.property.metadata.format\">\r" +
    "\n" +
    " 		        <span ng-switch-when=\"date\">\r" +
    "\n" +
    "					{{ field.property.value | date:field.format }}<i ng-if=\"field.icon\" class=\"fa fa-{{field.icon}}\"></i>\r" +
    "\n" +
    "				</span>\r" +
    "\n" +
    "				<span ng-switch-default>\r" +
    "\n" +
    "					{{ field.property.value }}<i ng-if=\"field.icon\" class=\"fa fa-{{field.icon}}\"></i>\r" +
    "\n" +
    "				</span>\r" +
    "\n" +
    "			</ng-switch>\r" +
    "\n" +
    "		</span>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-money.html',
    "<span class=\"form-group has-feedback\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input 	type=\"text\"\r" +
    "\n" +
    "				class=\"form-control\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				decimal\r" +
    "\n" +
    "				decimal-precision=\"field.attributes.decimalprecision\"\r" +
    "\n" +
    "				decimal-min=\"field.attributes.minimum\"\r" +
    "\n" +
    "				decimal-max=\"field.attributes.maximum\" />\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<i class=\"form-control-feedback fa fa-lg fa-{{field.attributes.currency}}\"></i>\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-multiselect.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<span 	id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "				<!-- FIXME: UNCOMPLETED: ng-repeat to display collection's items. We do not know yet any backend response to be displayed this way, so this development is unfinished -->\r" +
    "\n" +
    "				<div class=\"multiselect-row\" ng-repeat=\"item in field.property.items\">\r" +
    "\n" +
    "					<!-- Display the href until we know any kind of response to be taken as an example -->\r" +
    "\n" +
    "					<span>{{item.entity.href}}</span>\r" +
    "\n" +
    "				</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		</span>\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-number.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input  type=\"number\"\r" +
    "\n" +
    "				class=\"form-control\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				min=\"{{field.attributes.min}}\"\r" +
    "\n" +
    "				max=\"{{field.attributes.max}}\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\" />\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-percentage.html',
    "<span class=\"form-group has-feedback\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "	\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input 	type=\"number\"\r" +
    "\n" +
    "				class=\"form-control\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				decimal\r" +
    "\n" +
    "				decimal-precision=\"field.attributes.decimalprecision\"\r" +
    "\n" +
    "				decimal-min=\"field.attributes.minimum\"\r" +
    "\n" +
    "				decimal-max=\"field.attributes.maximum\" /> \r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<i class=\"form-control-feedback fa fa-lg fa-percent\"></i>\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-select.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">	\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<select class=\"form-control\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\"\r" +
    "\n" +
    "				ng-options=\"value for value in field.options._getData(field.id, field)\"\r" +
    "\n" +
    "				capitalize=\"{{field.attributes.capitalize}}\" />\r" +
    "\n" +
    "		</select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!--\r" +
    "\n" +
    "	TODO: customtooltip=\"field.options.length\" maybe angular-strap.tooltip??\r" +
    "\n" +
    "-->"
  );


  $templateCache.put('src/ocInfra/templates/components/input-text.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "	\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input 	type=\"text\"\r" +
    "\n" +
    "				class=\"form-control\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "				maxlength=\"{{field.attributes.maxlength}}\"\r" +
    "\n" +
    "				\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\" \r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				capitalize=\"{{field.attributes.capitalize}}\" />\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-textMask.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<input 	type=\"text\"\r" +
    "\n" +
    "				class=\"form-control\"\r" +
    "\n" +
    "				autocomplete=\"off\"\r" +
    "\n" +
    "				id=\"{{field.id}}\"\r" +
    "\n" +
    "				name=\"{{field.name}}\"\r" +
    "\n" +
    "				placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ng-model=\"field.property.value\"\r" +
    "\n" +
    "				ng-required=\"field.property.required\"\r" +
    "\n" +
    "				ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "				ng-change=\"field.onChange()\"\r" +
    "\n" +
    "				ng-blur=\"field.onBlur()\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "				ui-mask=\"{{field.attributes.mask}}\"\r" +
    "\n" +
    "				clearOnBlur=\"false\"\r" +
    "\n" +
    "				capitalize=\"{{field.attributes.capitalize}}\" />\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-textarea.html',
    "<span class=\"form-group\" \r" +
    "\n" +
    "	  ng-show=\"field.isVisible()\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<span ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\" class=\"col-xs-12\">\r" +
    "\n" +
    "	\r" +
    "\n" +
    "		<div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "		<textarea 	class=\"form-control\"\r" +
    "\n" +
    "					autocomplete=\"off\"\r" +
    "\n" +
    "					id=\"{{field.id}}\"\r" +
    "\n" +
    "					name=\"{{field.name}}\"\r" +
    "\n" +
    "					placeholder=\"{{field.placeholder | translate}}\"\r" +
    "\n" +
    "					maxlength=\"{{field.attributes.maxlength}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "					ng-model=\"field.property.value\"\r" +
    "\n" +
    "					ng-required=\"field.property.required\"\r" +
    "\n" +
    "					ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "					ng-change=\"field.onChange()\"\r" +
    "\n" +
    "					ng-blur=\"field.onBlur()\" ></textarea>\r" +
    "\n" +
    "		\r" +
    "\n" +
    "		<div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "	</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('src/ocInfra/templates/components/input-toggle.html',
    "<span class=\"form-group\">\r" +
    "\n" +
    "    <label ng-if=\"field.label\" for=\"{{field.name}}\" id=\"{{field.name}}Label\" class=\"control-label col-sm-4 col-xs-12\" ng-class=\"field.property.required ? 'required-star' : ''\">{{field.label | translate}}</label>\r" +
    "\n" +
    "    <span class=\"col-xs-12\" ng-class=\"(!field.label && field.property.required) ? 'col-sm-12 required-star' : (field.label ?'col-sm-8' : '')\">\r" +
    "\n" +
    "        <div class=\"help-tooltip-container\" ng-if=\"field.tooltip && field.tooltip !== ''\" ng-include=\"'src/ocInfra/templates/components/help-tooltip-display.html'\"></div>\r" +
    "\n" +
    "        <label  class=\"btn btn-default col-xs-6\"\r" +
    "\n" +
    "                name=\"{{field.name}}\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "                ng-model=\"field.property.value\"\r" +
    "\n" +
    "                ng-required=\"field.property.required\"\r" +
    "\n" +
    "                ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "                ng-change=\"field.onChange()\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "                uib-btn-radio=\"false\">\r" +
    "\n" +
    "            <span>{{field.attributes.false_label | translate}}</span>\r" +
    "\n" +
    "        </label>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <label  class=\"btn btn-default col-xs-6\"\r" +
    "\n" +
    "                name=\"{{field.name}}\"\r" +
    "\n" +
    "                \r" +
    "\n" +
    "                ng-model=\"field.property.value\"\r" +
    "\n" +
    "                ng-required=\"field.property.required\"\r" +
    "\n" +
    "                ng-disabled=\"!field.property.editable\"\r" +
    "\n" +
    "                ng-change=\"field.onChange()\"\r" +
    "\n" +
    "\r" +
    "\n" +
    "                uib-btn-radio=\"true\" >\r" +
    "\n" +
    "            <span>{{field.attributes.true_label | translate}}</span>\r" +
    "\n" +
    "        </label>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "        <div ng-include=\"'src/ocInfra/templates/components/backend-error-display.html'\"></div>\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!--\r" +
    "\n" +
    "    TODO: init labels in directive controller defaults\r" +
    "\n" +
    "-->"
  );


  $templateCache.put('src/ocInfra/templates/components/input.html',
    "<span ng-include=\"inputHtmlUrl\" class=\"form-group\"></span>"
  );


  $templateCache.put('src/ocInfra/templates/components/popup.html',
    "<div class=\"modal fade\" data-keyboard=\"false\" data-backdrop=\"static\" id=\"{{ popup.id }}\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"{{ popup.labels.title | translate }}\" aria-hidden=\"true\">\r" +
    "\n" +
    "    <div class=\"modal-dialog modal-lg\">\r" +
    "\n" +
    "        <div class=\"modal-content\">\r" +
    "\n" +
    "            <div class=\"modal-header\">\r" +
    "\n" +
    "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"{{ popup.labels.close | translate }}\"><span aria-hidden=\"true\" ng-click=\"execute(popup.actions._close)\">&times;</span></button>\r" +
    "\n" +
    "                <h4 class=\"modal-title\">{{ popup.labels.title | translate }}</h4>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"modal-body\">\r" +
    "\n" +
    "                \r" +
    "\n" +
    "               <renderer metamodel='metamodel' resource-url='resourceUrl' factory-name='factoryName'></renderer>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div class=\"clearfix\"></div>\r" +
    "\n" +
    "            <div class=\"modal-footer\">\r" +
    "\n" +
    "            	<button type=\"button\" class=\"btn btn-primary\" ng-if=\"popup.actions._cancel\" ng-click=\"execute(popup.actions._cancel)\" data-dismiss=\"modal\">{{ popup.labels.cancel | translate }}</button>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-if=\"popup.actions._reset\" ng-click=\"execute(popup.actions._reset)\">{{ popup.labels.reset | translate }}</button>\r" +
    "\n" +
    "                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"execute(popup.actions._ok)\" data-dismiss=\"modal\">{{ popup.labels.ok | translate }}</button>\r" +
    "\n" +
    "              </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<button class=\"btn btn-primary\" ng-if=\"popup.trigger\" data-toggle=\"modal\" data-target=\"#{{popup.id}}\">{{ popup.trigger | translate }}</button>"
  );


  $templateCache.put('src/ocInfra/templates/components/renderer.html',
    "<div class=\"renderer\">\r" +
    "\n" +
    "	<div ng-repeat=\"section in metamodelObject.sections track by $index\" class=\"section\" ng-class=\"section.colspan ? 'col-sm-{{section.colspan}}': 'col-sm-12'\" ng-switch on=\"section.type\">	\r" +
    "\n" +
    "		<div class=\"oc-modal-header border-none\">\r" +
    "\n" +
    "		    <div ng-if=\"section.logodir == true\" class=\"oc-logo\" style=\"margin-left: auto;margin-right: auto;\"></div>\r" +
    "\n" +
    "        	<h3 class=\"text-left\">{{section.title | translate}}</h3>\r" +
    "\n" +
    "        	<hr ng-if=\"screenId!=='anonymous'\"class=\"onl_hrOr_1\"><hr ng-if=\"screenId!=='anonymous'\" class=\"onl_hrOr_2\">\r" +
    "\n" +
    "        	<hr ng-if=\"screenId=='anonymous'\" class=\"onl_hrOr_2\" style=\"width:100%\">\r" +
    "\n" +
    "    	</div>\r" +
    "\n" +
    "	\r" +
    "\n" +
    "		<div ng-switch-when=\"reference\" class=\"linkedRenderer\">\r" +
    "\n" +
    "			<renderer metamodel=\"section.$ref\"></renderer>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "		<div ng-switch-default>\r" +
    "\n" +
    "			<form>\r" +
    "\n" +
    "				<div ng-repeat=\"row in section.rows\" class=\"row\">\r" +
    "\n" +
    "					<div ng-repeat=\"column in row track by $index\" class=\"oc-column col-sm-{{column.colspan}}\">\r" +
    "\n" +
    "						<div ng-if=\"column\" ng-switch on=\"column.type\">\r" +
    "\n" +
    "					      	<div ng-switch-when=\"table\" class=\"table-responsive\">\r" +
    "\n" +
    "								<table-render ng-if=\"resourcesToBind[column.id].items\" resource-url=\"resourcesToBind[column.id].href\" metamodel=\"column.metamodel\" factory-name=\"factoryName\"></table-render>\r" +
    "\n" +
    "							</div>\r" +
    "\n" +
    "							<div ng-switch-when=\"buttonGroup\">\r" +
    "\n" +
    "								<div ng-repeat=\"button in column.buttons\">\r" +
    "\n" +
    "									<button ng-if=\"button.label\" class=\"btn btn-primary renderer-button\" ng-click=\"execute(button.action, button.actionURL)\">{{ button.label | translate }}</button>\r" +
    "\n" +
    "									<i ng-if=\"button.icon\" class=\"fa fa-2x {{button.icon}} renderer-button\" title=\"{{ button.tooltip | translate }}\" ng-click=\"execute(button.action)\"></i><br ng-if=\"button.underlineText\" />\r" +
    "\n" +
    "									<span ng-if=\"button.underlineText\">{{button.underlineText}}</span>\r" +
    "\n" +
    "								</div>\r" +
    "\n" +
    "							</div>\r" +
    "\n" +
    "							<div ng-switch-when=\"iconGroup\">\r" +
    "\n" +
    "								<div class=\"col-xs-6 col-md-6\" ng-repeat=\"icon in column.icons\">\r" +
    "\n" +
    "									<div ng-click=\"execute(icon.action, icon.actionURL)\" class=\"text-center \">\r" +
    "\n" +
    "            							<a ng-click=\"execute(icon.action, icon.actionURL)\" class=\"thumbnail text-center\">\r" +
    "\n" +
    "            							<div class=\"text-center\">\r" +
    "\n" +
    "              								<span class=\"{{icon.icon}}\"></span>\r" +
    "\n" +
    "              								<div class=\"text-center\">{{icon.label | translate}}  <span class=\"flag {{icon.iconflags}}\"></span></div>\r" +
    "\n" +
    "            							</div>\r" +
    "\n" +
    "            							</a>\r" +
    "\n" +
    "          							</div>\r" +
    "\n" +
    "								</div>\r" +
    "\n" +
    "							</div>\r" +
    "\n" +
    "							<div ng-switch-default>\r" +
    "\n" +
    "								<div ng-repeat=\"id in column.id\">\r" +
    "\n" +
    "									<input-render ng-if=\"(resourcesToBind.properties && column.uiInput) || isVisible(resourcesToBind.properties[id], column)\" property=\"resourcesToBind.properties[id]\" metamodel=\"column\" update-mode=\"{{column.updateMode}}\" on-update=\"{{column.onUpdate}}\" base-url=\"{{column.baseUrl}}\" resources=\"resourcesToBind.properties\"></input-render>\r" +
    "\n" +
    "								</div>	\r" +
    "\n" +
    "							</div>\r" +
    "\n" +
    "						</div>\r" +
    "\n" +
    "					</div>\r" +
    "\n" +
    "				</div>\r" +
    "\n" +
    "			</form>\r" +
    "\n" +
    "		</div>\r" +
    "\n" +
    "	</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/ocInfra/templates/components/table.html',
    "<div class=\"col-md-12\">\r" +
    "\n" +
    "	<table st-table=\"displayedItems\" st-safe-src=\"items\" class=\"table table-striped table-condensed\">\r" +
    "\n" +
    "		<thead ng-if=\"metamodelObject.header !== 'hide'\">\r" +
    "\n" +
    "			<tr>\r" +
    "\n" +
    "				<th ng-repeat=\"column in metamodelObject.properties\" ng-attr-style=\"text-align : {{column.align}}; width: {{column.width}} !important; \">{{ column.label_header | translate }}</th>\r" +
    "\n" +
    "			</tr>\r" +
    "\n" +
    "			<tr ng-show=\"metamodelObject.searching\">\r" +
    "\n" +
    "				<th colspan=\"{{metamodelObject.properties.length}}\">\r" +
    "\n" +
    "					<input st-search placeholder=\"Enter text to search ...\" class=\"input-sm form-control\" type=\"search\"/>\r" +
    "\n" +
    "				</th>\r" +
    "\n" +
    "			</tr>\r" +
    "\n" +
    "		</thead>\r" +
    "\n" +
    "		<tbody>\r" +
    "\n" +
    "			<tr ng-repeat=\"displayedItem in displayedItems track by $index\">\r" +
    "\n" +
    "				<td ng-repeat=\"field in metamodelObject.properties\" ng-attr-style=\"text-align : {{field.align}}; width: {{field.width}} !important; \">\r" +
    "\n" +
    "		            <ng-switch on=\"field.type\">\r" +
    "\n" +
    "		                <span ng-switch-when=\"label\">\r" +
    "\n" +
    "		                    <span>{{ displayedItem.properties[field.id].value }}</span>\r" +
    "\n" +
    "		                </span>\r" +
    "\n" +
    " 						<span ng-switch-when=\"multilabel\">\r" +
    "\n" +
    "		                    <span ng-repeat=\"fieldId in field.id track by $index\">{{ displayedItem.properties[fieldId].value }}&nbsp;</span>\r" +
    "\n" +
    "		                </span>\r" +
    "\n" +
    "		                <span ng-switch-when=\"date\">{{ displayedItem.properties[field.id].value | date:field.format }}</span>\r" +
    "\n" +
    "		                <span ng-switch-when=\"literal\">{{ field.id | translate }}</span>\r" +
    "\n" +
    "		                <span ng-switch-when=\"blank\">&nbsp;</span>\r" +
    "\n" +
    "		                <span ng-switch-when=\"status\"><i class=\"{{isValidStatus(displayedItem) ? 'fa fa-check-square text-success':'fa fa-minus-square text-danger'}}\"></i></span>\r" +
    "\n" +
    "		                <span ng-switch-when=\"icon\">\r" +
    "\n" +
    "		                	<span ng-if=\"field.icon\" class=\"{{field.icon}} iconText\"></span>	\r" +
    "\n" +
    "		                	<span ng-if=\"!field.icon\" class=\"{{metamodelObject.iconList[displayedItem.properties[field.id].value]}} iconText\"></span>		\r" +
    "\n" +
    "		                </span>\r" +
    "\n" +
    "		                 <span ng-switch-when=\"checkbox\">\r" +
    "\n" +
    "	                            <input type=\"checkbox\" ng-change=\"execute({value: 'update'}, displayedItem, field)\" ng-model=\"displayedItem.properties[field.id].value\" ng-disabled=\"!displayedItem.properties[field.id].editable\">\r" +
    "\n" +
    "	                    </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		                 <span ng-switch-when=\"actions\">\r" +
    "\n" +
    "		                	<span ng-repeat=\"action in field.options\">\r" +
    "\n" +
    "		                		<ng-switch on=\"action.value\">\r" +
    "\n" +
    "						            <span ng-switch-when=\"edit\">\r" +
    "\n" +
    "						                <a><i data-toggle=\"modal\" data-target=\"#modal_{{metamodelObject.name}}\" class=\"action {{action.icon}}\" ng-class=\"action.icon? 'actionIcon':''\" ng-click=\"execute(action, displayedItem)\"><span ng-if=\"!action.icon\">{{action.title | translate }}</span></i>\r" +
    "\n" +
    "						               </a>\r" +
    "\n" +
    "						            </span>\r" +
    "\n" +
    "						            <span ng-switch-when=\"delete\">\r" +
    "\n" +
    "						                <a><i class=\"action {{action.icon}}\" ng-class=\"action.icon? 'actionIcon':''\" ng-click=\"execute(action, displayedItem)\" ng-show=\"displayedItem.deletable\"><span ng-if=\"!action.icon\">{{action.title | translate }}</span></i>\r" +
    "\n" +
    "						                </a>\r" +
    "\n" +
    "						            </span>\r" +
    "\n" +
    "						            <span ng-switch-default>\r" +
    "\n" +
    "						            	<a><i class=\"action {{action.icon}}\" ng-class=\"action.icon? 'actionIcon':''\" ng-click=\"execute(action, displayedItem)\"><span ng-if=\"!action.icon\">{{action.title | translate }}</span></i>\r" +
    "\n" +
    "						            	</a>\r" +
    "\n" +
    "						            </span>\r" +
    "\n" +
    "						        </span>\r" +
    "\n" +
    "				        	</span>\r" +
    "\n" +
    "		                </span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "		            </ng-switch>\r" +
    "\n" +
    "		            \r" +
    "\n" +
    "				</td>\r" +
    "\n" +
    "			<tr>\r" +
    "\n" +
    "		</tbody>\r" +
    "\n" +
    "		<tfoot ng-if=\"metamodelObject.pagination\">\r" +
    "\n" +
    "			<tr>\r" +
    "\n" +
    "				<td colspan=\"{{metamodelObject.properties.length}}\">\r" +
    "\n" +
    "					<div class=\"pull-right\" st-pagination=\"\" st-items-by-page=\"5\" st-displayed-pages=\"7\"></div>\r" +
    "\n" +
    "				</td>\r" +
    "\n" +
    "			</tr>\r" +
    "\n" +
    "		</tfoot>\r" +
    "\n" +
    "	</table>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<div>\r" +
    "\n" +
    "		<span ng-if=\"metamodelObject.buttonLabel\">\r" +
    "\n" +
    "		    <button data-toggle=\"modal\" data-target=\"#modal_{{metamodelObject.name}}\" ng-click=\"execute({ value: 'add', buttonAction: true })\" class=\"btn btn-primary btn-mg\" ng-disabled=\"!resultSet[resourceUrl].creatable\">\r" +
    "\n" +
    "		    	{{ metamodelObject.buttonLabel | translate }}\r" +
    "\n" +
    "		    </button>\r" +
    "\n" +
    "		</span>\r" +
    "\n" +
    "	</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "	<popup-render ng-if=\"modalMetamodelObject\" ui-id=\"modal_{{metamodelObject.name}}\" metamodel=\"metamodelObject.modalRef\" resource-url=\"itemSelected.href\" factory-name=\"factoryName\"></popup-render>\r" +
    "\n"
  );

}]);
