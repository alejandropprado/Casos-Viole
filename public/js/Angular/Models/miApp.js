var app = angular.module('Casos',['ngRoute','ngTable','angular-jwt', 'ui.router']);

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
    })

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

app.controller('loginCtrl', ['$scope', 'loginApi', '$location', '$state', function($sp, loginApi, $location, $state){

  try {
    window.localStorage.removeItem('token');
  } catch(e) {
    console.log(e);
  }

  $sp.login = function(user){
    loginApi.login(user).then( function(resp){
      var token = JSON.stringify(resp.data);      
      window.localStorage.setItem('token', token);      
      $state.go('home.dashboard');
    });
  };

  $sp.signup = function(user){
    loginApi.signup(user).then( function(resp){
      if (resp.data.message === 'OK'){
        alert('Registro Completado');
        $sp.userR = {};
      }
    });
  };

}]);

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