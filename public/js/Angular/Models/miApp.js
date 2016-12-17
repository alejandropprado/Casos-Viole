var app = angular.module('Casos',['ngRoute','ngTable','angular-jwt', 'ui.router','cgNotify']);

app.config([
  '$routeProvider', 
  '$stateProvider', 
  '$urlRouterProvider', 
  '$httpProvider', 
  'jwtInterceptorProvider', 
  function($ruta, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {

    jwtInterceptorProvider.tokenGetter = function(){
      return window.localStorage.getItem('token');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('/','/inicio');

    $stateProvider
    .state('login',{
      templateUrl: '/pages/login.html',
      url:'/login',
      controller: 'loginCtrl' 
    })
    .state('home',{
      templateUrl: '/pages/home.html',
      url:'/',
    })    
    .state('home.casos',{
      templateUrl : '/pages/casos.html',
      url: '/todos-los-casos',
      controller : 'ctrlCasos',
    })
    .state('home.horarios',{
      templateUrl : '/pages/horarios.html',
      controller : 'ctrlHorarios',
      url:'horarios'
    }).
    state('home.dashboard', {
      templateUrl : '/pages/inicio.html',
      url:'inicio'
    });

  }]);

app.service('ApiJovenes', ['$http','$q', function($http,$q){
  this.Api = function(method,url,data){
    var deferred = $q.defer();
    var options = {};

    options.skipAuthorization = false;

    switch (method) {
      case 'GET':
      options.method = method;
      options.url = url;      
      break;
      case 'POST':
      options.method = method;
      options.url = url;    
      options.data = data 
      break;
      case 'DELETE':
      options.method = method;
      options.url = url;  
      break;
      case 'PUT':
      options.method = method;
      options.url = url;    
      options.data = data 
      break;
    }

    $http(options).success(function(data){
      deferred.resolve(data);
    })
    .error(function(msg,code){
      deferred.reject(msg);
    });
    return deferred.promise;
  };
  
}]);

app.service('loginApi', ['$http', function($http){

  this.login = function(user){
    return $http({
      method:'POST',
      skipAuthorization : false,
      url:'/auth/login',
      data: user
    });
  };

  this.signup = function(user){
    return $http({
      method:'POST',
      skipAuthorization :false,
      url:'/auth/signup',
      data: user
    });
  };

}]);

app.service('FBLogin', function(){
  var _this = this;

  var scopesFB = 'email, user_friends, public_profile';

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1761122240880256',
      xfbml      : true,
      cookie     : true,
      status     : true,
      version    : 'v2.8'
    });

    _this.Conectado = function ( next ){
      FB.getLoginStatus( function (resp) {   
        console.log(resp)     
        if (resp.status === 'connected'){
          next(true);
        } else {
          next(false);
        }
      });
    };

    _this.Logout = function(next){
      FB.getLoginStatus( function (resp) {        
        if (resp.status === 'connected'){
          FB.logout( function (resp) {
            console.log(resp);
          });          
        }

        next();
      });
    };

    _this.Login = function( next ){    
      _this.Conectado(function (conectado) {
        console.log(conectado);
        if (!conectado) {
          FB.login( function (resp) {  
            if (resp.authResponse) {
              FB.api('/me', {fields: 'name, email'}, function (response) {
                console.log(response);
                var user = {
                  proveedor: 'FB',
                  idProveedor: response.id,
                  nombre : response.name,
                  email : response.email,
                  imagen : 'https://graph.facebook.com/'+response.id+'/picture?type=large'
                };
                next(user)
              });
            }
          }, { 
            scope : scopesFB,
            return_scopes: true
          });
        } else {
          FB.api('/me', {fields: 'name, email'}, function (response) {
            var user = {
              proveedor: 'FB',
              idProveedor: response.id,
              nombre : response.name,
              email : response.email,
              imagen : 'https://graph.facebook.com/'+response.id+'/picture?type=large'
            };
            next(user)
          });
        }
      });  
    };
  }
});

app.service('GoogleLogin', function(){

  var resizeImage = function (url) {
    var replace = url.replace('sz=50', 'sz=200');
    return replace;
  };

  this.Login = function (next){
    var params = {
      clientid : '462267108268-r6oeqpvpf07s1ja4c9dtk6fgehamr9he.apps.googleusercontent.com',
      cookiepolicy : 'single_host_origin',
      callback : function (result){
        if( result['status']['signed_in'] ){
          var req = gapi.client.plus.people.get({
            userId : 'me'
          });

          req.execute( function (response) {
            console.log(response);  
            var user = {
              proveedor: 'GG',
              idProveedor: response.id,
              nombre : response.displayName,
              email : response.emails[0].value,
              imagen : resizeImage(response.image.url)
            };          

            next(user);
          });
        }
      },
      approvalprompt : 'force',
      scope : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
    };    

    gapi.auth.signIn(params);
  }  
});

app.run(function($rootScope, $location, $state) {

  $rootScope.$on( '$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

    var ruta = toState.name;
    if(ruta != 'login'){
      if(!window.localStorage.getItem('token')){
        e.preventDefault();
        $state.go('login');
      }
    }else{
      return;
    }

  });
});