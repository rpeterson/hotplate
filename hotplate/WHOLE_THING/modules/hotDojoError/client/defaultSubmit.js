define([
  'dojo/_base/declare',
  'dojo/query',
  'dojo/aspect',
  'dojo/_base/lang',
  'dojo/_base/json',
  'dojo/text!app/widgets/templates/RetypePassword.html',

  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  'dijit/registry',
  'dijit/Tooltip',


  "app/lib/globalWidgets",
  "app/lib/Logger",
  "app/lib/stores",
  "hotplate/baseProtocol/main",

  'app/widgets/ValidationPassword',
  "app/widgets/AlertBar",
  "app/widgets/BusyButton",

  ],function(
    declare
  , query
  , aspect
  , lang
  , json
  , retypePasswordTemplateString

  , _WidgetBase
  , _TemplatedMixin
  , _WidgetsInTemplateMixin
  , registry
  , Tooltip

  , gw
  , Logger
  , stores
  , protocol

  , ValidationPassword
  , AlertBar
  , BusyButton

  ){

  var r = {}

  r.defaultSubmit = function(form, button, callback){

    return function(e){

      // Prevent the default
      e.preventDefault();

      // Make the button busy
      button ? button.makeReallyBusy() : null;

      // Validate the form
      form.validate();
      if(! form.isValid() ){
        Logger("Didn't validate, cancelling");
        button ? button.cancel() : null;
      } else {

        // Call the callback
        callback();

        // Prevent form submission (it will be submitted through Ajax)
        return false;
      }

    }
  }



  // Function to show error messages on JsonRest put() and post() calls
  //
  r.UIMsg = function( type, form, button, alertBar, noLogin ){

    if( type == 'ok') {
      // AJAX JsonRest success let's see what was returned!
      return  function(res){

         if(! res){

          // ***************************************
          // BAD: RESPONSE FROM THE SERVER WAS EMPTY
          // This happens on connection refused
          // ***************************************

          // Cancel the submit button
          button ? button.cancel() : null;

          // Show the error at application level
          gw.appAlertBar.set('message', 'Connection to server failed');
          gw.appAlertBar.show(5000);

          Logger("Got an empty result from xhr call");
          throw(new Error("Empty result from xhr call"));

        } else {


          // Cancel the submit button
          button ? button.cancel() : null;
          Logger("The form was accepted by the server");

          // Ready for the next chained call, with "res" cleaned up
          return protocol.goodify(res);
        }
      }
    }


    if( type == 'error'){


      // AJAX JsonRest failure: set error messages etc. and rethrow
      return function(err){

        var res;

        try { 
          res = json.fromJson(err.responseText)  
        } catch(e){
          res = { };
        }
        res = protocol.goodify(res);
        // res.message = res.message || err.message;

        switch(err.status){

          // ValidationError
          case 422:

            // ***********************************************
            // WATCH OUT: RESPONSE FROM THE SERVER WAS "ERROR"
            // ***********************************************

            // This array will contain the list of widgets for which the server
            // didn't like values, but didn't enforce a change before re-submitting
            var artificialErrorWidgets = [];

            // There is a message: display it
            if( res.message && alertBar ){
              alertBar.set('message','Error: ' + res.message );
              alertBar.show(); // Persistent
            }

            res.errors.forEach( function(error){
    
              // This cannot really happen anymore, FIXME: DELETEME
              if( error.field == ''){
              } else {

                // Get the widget by its name. 
                var field = query("form#"+form.id+" input[name='" + error.field + "']");
                

                if(field.length && field[0].id && (widget = registry.byId( field[0].id ) ) ){

                  // Add a validator around it if the error is "persistent" (the client
                  // never wants that value again)
                  if(error.mustChange){

                    // Create a new badValue variable which contains the "bad apple"
                    var badValue = widget.get('value');
  
                    // Use Dojo aspects to add an extra check to the original widget's
                    // validation function, so that the client will never ever serve
                    // that function again
                    aspect.around(widget, 'validator', function(originalValidator){
                      return function(value){
                        if( value == badValue){
                          this.invalidMessage = error.message;
                          return false;
                        } else {
                          return originalValidator.call(this, value);
                        }
                      };
                    });

 
                  } else {

                    // Populates the array containing widgets for which an error will
                    // be raised artificially (not persistent) AFTER validation is forced
                    // (see below)
                    artificialErrorWidgets.push( { widget: widget, message: error.message }); 
                  }

                } else {
                  Logger("Widget not found: " + error.field);
                }

              }

            });                      

            // Now that we might possibly have more validators attached,
            // get the form to validate again
            form.validate();

            // Artificially (VERY artificially) get the error to show. This is not due to
            // validation, so as soon as the focus is there, it will disappear
            artificialErrorWidgets.forEach(function(w){ 
              widget = w.widget;
              message = w.message;
              widget.set('state','Error')
              Tooltip.show(message, widget.domNode, widget.tooltipPosition, !widget.isLeftToRight());
            });

            // Cancel the submit button
            button ? button.cancel() : null;

            Logger("Response came back with validation errors: " + json.toJson(res.errors) );

            // Rethrow
            throw(err);
          break;   

          // BadTokenError, ForbiddenError
          case 403:

            // Only show the alert and the problems if the noLogin flag is false. This flag is basically for
            // the login form and the recoverPassword form and for the workspace form
            // Show the error at application level
            gw.appAlertBar.set('message', 'Authentication problem: ' + res.message );
            gw.appAlertBar.show(5000);

            if(! noLogin){

              // Show the form to retype the password
              r.retypePasswordDialog.show();
            }

            // Cancel the submit button
            button ? button.cancel() : null;

            Logger("Response came back with error 403: " + res.message);

            // Rethrow
            throw(err);
 
          break;

          // Other errors
          default:

            // Show the error at application level
            gw.appAlertBar.set('message', 'Application error: ' + res.message + ' Status: ' + err.status );
            gw.appAlertBar.show(5000);

            // Cancel the submit button
            button ? button.cancel() : null;

            Logger("Respose came back with error 500: " + res.message + ' Status: ' + err.status );

            // Rethrow
            throw(err);
          break;

        }
        throw(err);

      }
    }

  };


  return r;
});

