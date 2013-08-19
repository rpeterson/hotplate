define([
  'dojo/_base/declare',
  'dijit/form/ValidationTextBox',

  'hotplate/hotDojoWidgets/_AjaxValidatorMixin',
  'hotplate/hotDojoStores/stores',
  ], function(
    declare

  , ValidationTextBox
  , _AjaxValidatorMixin
  , stores
  ){
 
   var Validators = sharedFunctions.hotCoreCommonValidators;

    return declare('hotplate.hotDojoAuth.ValidationWorkspace', [ ValidationTextBox, _AjaxValidatorMixin ], {

      ajaxOkWhen: 'present',
      ajaxInvalidMessage: 'Ajax check failed',

      validator: function(value){

        // Run the normal field validators -- if they fail,
        // return false
        var validation =  Validators.workspace(value);
        if( ! validation ){
          this.invalidMessage = Validators.workspace(false);
          return false;
        }

        return this.ajaxValidate(value, {
           ajaxInvalidMessage: this.ajaxInvalidMessage,
           ajaxStore: stores('workspacesAnon'),
           ajaxFilterField: 'name',
           ajaxOkWhen: this.ajaxOkWhen,
        });

      },

      invalidMessage: Validators.workspace(false),
      missingMessage: Validators.notEmptyString(false),

    });
  }
);
