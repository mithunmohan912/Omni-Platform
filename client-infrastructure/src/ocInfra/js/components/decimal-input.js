app.directive('decimalInput', function(){
    // Regex to match numbers (positive/negative) with dots and commas
    var regex_valid_chars = /^\$?-?\d+([\.\,]{0,1}\d*){0,1}$/;

    // Function to parse a str as a float. Returns the number parsed with the specified precision, NaN or undefined
    function _parseFloat(str, precision){
        var numberToParse;
        if(!str){
            return undefined;
        }

        // We need it to be a string
        str += '';

        // If the number has both decimal and milliard separators
        if(str.indexOf(',') > 0 && str.indexOf('.') > 0){
            if(str.lastIndexOf(',') > str.lastIndexOf('.')){
                numberToParse = str.substring(0, str.lastIndexOf(',')).replace(/,/g, '').replace(/\./g,'');
                numberToParse += str.substring(str.lastIndexOf(',')).replace(',','.');
            } else {
                numberToParse = str.substring(0, str.lastIndexOf('.')).replace(/,/g, '').replace(/\./g,'');
                numberToParse += str.substring(str.lastIndexOf('.'));
            }
        }
        // Cases for numbers with just decimal separator
        else if(str.indexOf(',') > 0){
            numberToParse = str.substring(0, str.lastIndexOf(',')).replace(/,/g, '');
            numberToParse += str.substring(str.lastIndexOf(','), (str.lastIndexOf(',') + precision) < str.length ? str.lastIndexOf(',')+precision+1 : str.length).replace(',','.');
        } else if(str.indexOf('.') > 0){
            numberToParse = str.substring(0, str.lastIndexOf('.')).replace(/\./g,'');
            numberToParse += str.substring(str.lastIndexOf('.'), (str.lastIndexOf('.') + precision) < str.length ? str.lastIndexOf('.')+precision+1 : str.length);
        } else {
            return parseFloat(str);
        }

        return parseFloat(numberToParse);
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            decimalPrecision: '=?',
            decimalMin: '=?',
            decimalMax: '=?'
        },
        link: function($scope, element, attrs, controller){
            // 2 decimals by default
            $scope.decimalPrecision = $scope.decimalPrecision || 2;
            $scope.decimalMin = $scope.decimalMin || 0;
            $scope.decimalMax = $scope.decimalMax || 9999999;

             controller.$parsers.unshift(function (viewValue) {

                if(!viewValue || viewValue === ''){
                    controller.$setValidity('decimal', true);
                    return viewValue;
                }

                if (regex_valid_chars.test(viewValue)) {
                    controller.$setValidity('decimal', true);
                    var number = _parseFloat(viewValue, $scope.decimalPrecision);
                    if(number < $scope.decimalMin){
                        number = $scope.decimalMin;
                        viewValue = number + '';
                    } else if(number > $scope.decimalMax){
                        number = $scope.decimalMax;
                        viewValue = number + '';
                    }

                    // If the viewValue ends with a character (dot, comma, zero) then we won't update the view because more numbers will be introduced
                    if(!isNaN(parseInt(viewValue.charAt(viewValue.length-1))) && parseInt(viewValue.charAt(viewValue.length-1)) !== 0){
                        controller.$setViewValue(number+'');
                        controller.$render();
                    } else{
                        if(viewValue.indexOf(',') > 0){
                            viewValue = viewValue.split(',')[1].length > $scope.decimalPrecision ? viewValue.substring(0, viewValue.indexOf(',') + $scope.decimalPrecision + 1) : viewValue;
                        } else if(viewValue.indexOf('.') > 0){
                            viewValue = viewValue.split('.')[1].length > $scope.decimalPrecision ? viewValue.substring(0, viewValue.indexOf('.') + $scope.decimalPrecision + 1) : viewValue;
                        }
                        controller.$setViewValue(viewValue);
                        controller.$render();
                    }
                    return number;
                } else {
                    // If the new value is not valid, lets keep the old model value
                    if(viewValue.length === 1 && viewValue.charAt(0) === '-'){
                        return viewValue;
                    } else if(isNaN(parseFloat(controller.$modelValue))){
                        controller.$setViewValue('0');
                    } else {
                        controller.$setViewValue(controller.$modelValue+'');
                    }
                    controller.$render();
                    return controller.$modelValue;
                }
            });

            controller.$formatters.unshift(
               function (modelValue) {

                    if(modelValue){
                        return parseFloat(modelValue).toFixed($scope.decimalPrecision);
                    }
                    // If there is no model value we can either set 0 as default value, or let the placeholder kick in. In this case
                    // we let the placeholder to appear
               }
           );
        }
    };
    });