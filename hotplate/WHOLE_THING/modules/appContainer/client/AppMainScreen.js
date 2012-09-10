define([
  "dojo/_base/declare",

  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",

   "dijit/layout/BorderContainer",
   "dijit/layout/StackContainer",
   "dijit/layout/TabContainer",
   "dijit/layout/ContentPane",
   "dijit/Dialog",

   "app/widgets/LogoutButton",
   "app/widgets/Dashboard",
   "app/widgets/SearchPage",

   ], function(
     declare
     , _WidgetBase
     , _TemplatedMixin
     , _WidgetsInTemplateMixin

     , BorderContainer
     , StackContainer
     , TabContainer
     , ContentPane
     , Dialog

     , LogoutButton
     , Dashboard
     , SearchPage

 ){
    // Create the "login" pane, based on a normal ContentPane
    return declare('AppMainScreen', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {


      widgetsInTemplate: true,

      templateString: '' +
        '<div>' +
        '  <div class="appContainer" data-dojo-type="dijit.layout.BorderContainer" data-dojo-props="design: \'headline\'">' +
        '    <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region: \'top\'">' +
        '       Booking Dojo <span data-dojo-type="app.LogoutButton"> </span>' +
        '   </div>' +
        '    <div data-dojo-type="dijit.layout.TabContainer" data-dojo-props="region: \'center\', tabPosition: \'left-h\'">' +
        '      <div data-dojo-type="app.Dashboard" data-dojo-props="title: \'Dashboard\'">Section One</div>' +
        '      <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="title: \'Two\'">Section Two</div>' +
        '      <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="title: \'Three\'">Section Three</div>' +
        '  </div>' +
        '</div>',

      postCreate: function(){


      }, // postCreate


   });

});

/*

  return  declare('AppContainer', BorderContainer, {
 
    postCreate:function(){

      this.inherited(arguments);

      // The top content
      this.topContent = new ContentPane({
        region: "top",
        "class": "edgePanel",
        content: "Welcome to Booking Dojo",
        splitter: true,
      })
      this.addChild(this.topContent);

      // The center content, which will contain several tabs
      this.centerContent = new TabContainer({
      id: "centerContent",
        region: "center",
        "class": "centerContent",
        tabPosition: "left-h",
      });
      this.addChild(this.centerContent); 

      this.centerContent.addChild(
        new ContentPane({
          title: "Dashboard"
        })
      );

      this.centerContent.addChild(
        new SearchPage({
          id: 'SearchPage',
          title: "Search",
        })
      );
      this.centerContent.addChild(
        new ContentPane({
          id: 'BookingsPage',
          title: "Bookings",
        })
      );
      // This will contain products settings (?)
      this.centerContent.addChild(
        new ContentPane({
          title: "Contacts"
        })
      );
      this.centerContent.addChild(
        new ContentPane({
          title: "Calendar"
        })
      );
      this.centerContent.addChild(
        new ContentPane({
          title: "Settings"
        })
      );
    } // postCreate()



  });

});





*/