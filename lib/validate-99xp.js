/**
* @license
* validate 99xp
* ----------------------------------
* v1.3.4
*
* Copyright (c)2021 Bruno Foggia, 99xp.
* Distributed under MIT license
*
* https://validate.99xp.org
*/


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('v8n-99xp'), require('underscore-99xp')) :
    typeof define === 'function' && define.amd ? define(['exports', 'v8n-99xp', 'underscore-99xp'], factory) :
    (global = global || self, factory(global.vl = {}, global.v8n, global._));
}(this, function (exports, v8n, _) { 'use strict';

    v8n = v8n && v8n.hasOwnProperty('default') ? v8n['default'] : v8n;
    _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

    // [validate-99xp](https://github.com/brunnofoggia/validate-99xp) is the automated way
    var vl = {
      validator: v8n,
      deepValueSearch: _.deepValueSearch,
      validateAll: true,

      // Core method the walk through fields and their set of rules applying each one of them
      validate(attrs, options = {}) {
        options = _.defaults(options, {
          validateAll: this.validateAll
        });
        var error = [],
            validations = this.getValidations(attrs, options),
            notEmptyValidation = this.validator().passesAnyOf(this.validator().minLength(1), this.validator().not.undefined().not.null().pattern(/.+/)),
            isRequired = {}; // walk through fields listed as required

        for (let field in validations) {
          isRequired[field] = true;
          var value = this.deepValueSearch(field, attrs, true); // working with array so we can validate lists like "contacts[][email]"

          (!_.isArray(value) && !_.isJSON(value) || !/\[\]\[\w+\]/.test(field) && _.isArray(value) // ensure to pass the correct value to test length of lists
          ) && (value = [value]);
          !_.isArray(validations[field]) && (validations[field] = [validations[field]]); // walk through field rule specifications

          for (let x in validations[field]) {
            let validation = validations[field][x];

            if (typeof validation[0] === 'boolean' || typeof validation[0] === 'undefined') {
              isRequired[field] = !(validation === false);

              if (!isRequired[field]) {
                continue;
              } // if is required, set default validation and error message for it


              validation = [notEmptyValidation, validation[1] || this.getRequiredErrorMessage(field), validation[2] || null];
            }

            error = error.concat(this.validateValues(value, isRequired[field], options.validateAll, field, attrs, validation));
          }
        }

        return error.length > 0 ? error : null;
      },

      validateValues(value, isRequired, validateAll, field, attrs, validation) {
        var error = [];

        for (var x in value) {
          error = error.concat(this.validateValue(x, value[x], isRequired, validateAll, field, attrs, validation));
        }

        return error;
      },

      validateValue(x, value, isRequired, validateAll, field, attrs, validation) {
        var error = [];
        let validationValue = this.getValidationValue(validation, value, attrs, field);

        if (this.isRequiredNow(validationValue, isRequired, validateAll) && !this.isValid(field, attrs, validation[0], validationValue)) {
          error.push([field, validation[1], x]);
        }

        return error;
      },

      getValidationValue(validation, value, attrs, field) {
        if (!validation[2] || typeof validation[2] !== 'function') {
          return value;
        }

        return validation[2](value, attrs, field);
      },

      getValidations(attrs, options = {}) {
        var definedValidations = _.result2(this, 'validations', {}, [attrs, options], this),
            validations = _.result2(options, 'validations', definedValidations, [attrs, options], this);

        return validations;
      },

      // Run through all validations to collect mandatory fields and validations
      getMandatoryValidations(attrs, options = {}) {
        var validations = this.getValidations(attrs, options),
            mandatory = {}; // walk through fields listed as required

        for (let field in validations) {
          !_.isArray(validations[field]) && (validations[field] = [validations[field]]); // walk through field rule specifications

          for (let x in validations[field]) {
            let validation = validations[field][x];

            if (typeof validation[0] === 'undefined' || typeof validation[0] === 'boolean' && validation[0] !== false || typeof validation[0] === 'object' && !validation[0].test('')) {
              !(field in mandatory) && (mandatory[field] = []);
              mandatory[field].push(validation);
            }
          }
        }

        return mandatory;
      },

      // A field will be required when its present in the set of rules - even if its value is an empty [] - 
      // AND (its present in the values received OR (its set as required and validate all was set true)) . 
      // A bit confusing I know. But this will allow you to run validate in your form everytime a field is changed avoiding
      // to alert of invalid fields that yet weren't filled by the guest
      isRequiredNow(input, fieldRequired = false, validateAll) {
        // the field will be required only if its value was sent or if its set as required (even without a specific rule)
        return typeof input !== 'undefined' || !!fieldRequired && !!validateAll;
      },

      // Apply the rule test to value received. value, attrs inputted and field name are sent to validation method - it can be handy.
      isValid(field, attrs, validation, value) {
        if (!validation.test(value)) {
          return false;
        }

        return true;
      },

      requiredErrorMessage: 'Field *{{field}}* cannot be empty',

      getRequiredErrorMessage(field) {
        return _.template(this.requiredErrorMessage)({
          field
        });
      }

    };

    exports.default = vl;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=validate-99xp.js.map
