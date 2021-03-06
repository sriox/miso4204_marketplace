define(['controller/selectionController', 'model/cacheModel', 'component/_CRUDComponent', 'controller/tabController', 'component/buyerComponent', 'component/purchaseComponent'],
 function(SelectionController, CacheModel, CRUDComponent, TabController, BuyerComponent, PurchaseComponent) {
    App.Component.CompositeComponent = App.Component.BasicComponent.extend({
        initialize: function() {
            this.componentId = App.Utils.randomInteger();
            this.name = "BuyerIntegration";
            this.buyerComponent = new BuyerComponent();
            this.buyerComponent.initialize();
            this.delegate = new App.Delegate.BuyerDelegate();
            this.purchaseComponent = new PurchaseComponent();
            this.setupBuyerComponent();
        },
        render: function(domElementId){
            if (domElementId) {
                var rootElementId = $("#"+domElementId);
                this.buyerElement = this.componentId + "-buyer";
                this.tabsElement = this.componentId + "-tabs";

                rootElementId.html("<div id='" + this.buyerElement + "'></div>" + "<div id='" + this.tabsElement + "'></div>");
            }
            this.buyerComponent.render(this.buyerElement);
        },
        setupBuyerComponent: function() {
            var self = this;
            Backbone.on('buyerForm-getPurchases', function(params) {
                self.compras(params);
            });
            
            this.buyerComponent.addGlobalAction({
                name: 'Windows',
                icon: 'glyphicon-user',
                displayName: 'Windows',
                show: true,
                menu: 'utils'
            },
            this.windows,
            this);
            
            this.buyerComponent.addGlobalAction({
                name: 'Facebook',
                icon: 'glyphicon-user',
                displayName: 'Facebook',
                show: true,
                menu: 'utils'
            },
            this.facebook,
            this);
            
            this.buyerComponent.addGlobalAction({
                name: 'Google',
                icon: 'glyphicon-user',
                displayName: 'Google',
                show: true,
                menu: 'utils'
            },
            this.google,
            this);
        },
        windows: function() {       
                  
            hello.init({ 
                'windows' : '00000000401357CD'                
            },
            {
               scope : 'email',
               oauth_proxy: 'https://auth-server.herokuapp.com/proxy'
            });               
           
	
	 //call user information, for the given network
	 hello('windows').login().then(function(){
             //alert("You are signed in to Windows");
                hello('windows').api('/me').then(function(response){       
                    $("#username").val(response.email);
                    $("#email").val(response.email);
                    $("#name").val(response.email);
                    $("#firstName").val(response.first_name);
                    $("#lastName").val(response.last_name);
                    $("#gender").val(response.gender);
                     //alert(response.email+", "+response.first_name+", "+response.last_name+", "+response.gender);
                });
            }, function(e){
                alert("Error al Autenticar: " + e.error.message);
            });
       },
        facebook: function() {
            hello.init({
                'facebook' : '751100841593326'
            },
            {
                scope : 'email',
                oauth_proxy: 'https://auth-server.herokuapp.com/proxy'
            });
            hello('facebook').login().then(function(){
                hello('facebook').api('/me').then(function(response){
                    $("#username").val(response.email);
                    $("#email").val(response.email);
                    $("#name").val(response.name);
                    $("#firstName").val(response.first_name);
                    $("#lastName").val(response.last_name);
                    $("#gender").val(response.gender);
                });
            }, function(e){
                alert("Error al Autenticar: " + e.error.message);
            });
        },
        google: function() {
            hello.init({
                'google' : '491584393580-kslq1aoen62du8rhgmlepdhudg12ldbb.apps.googleusercontent.com'
            },
            {
                scope : 'email',
                oauth_proxy: 'https://auth-server.herokuapp.com/proxy'
            });
            hello('google').login().then(function(){
                hello('google').api('/me').then(function(response){
                    $("#username").val(response.email);
                    $("#email").val(response.email);
                    $("#name").val(response.name);
                    $("#firstName").val(response.first_name);
                    $("#lastName").val(response.last_name);
                    $("#gender").val(response.gender);
                });
            }, function(e){
                alert("Error al Autenticar: " + e.error.message);
            });
        },
        compras: function(params) {
            var self = this;
            this.delegate.searchPurchases(params.id, function(data) {
                self.purchaseComponent.initialize({cache: {data: data, mode: "memory"},pagination: false});
                
                var rootElementId = $("#main");
                this.purchaseElement = this.componentId + "-purchase";
                rootElementId.html("<div id='" + this.purchaseElement + "'></div>");
                self.purchaseComponent.render(this.purchaseElement);
            });
        }
    });

    return App.Component.CompositeComponent;
});