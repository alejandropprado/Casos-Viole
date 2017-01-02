var app = angular.module('Casos',['ngRoute','ngTable','angular-jwt', 'ui.router','cgNotify','mwl.calendar','ui.bootstrap']);

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
      controller: 'ctrlRuta'
    })    
    .state('home.casos',{
      templateUrl : '/pages/casos.html',
      url: 'todos-los-casos',
      controller : 'ctrlCasos',
    })
    .state('home.horarios',{
      templateUrl : '/pages/horarios.html',
      controller : 'ctrlHorarios',
      url:'horarios'
    })
    .state('home.dashboard', {
      templateUrl : '/pages/inicio.html',
      url:'inicio'
    })
    .state('home.consultorios', {
      templateUrl : '/pages/consultorios.html',
      url:'hospitales-consultorios'
    })
    .state('home.cosam', {
      templateUrl : '/pages/cosam.html',
      url:'cosam'
    });

  }]);


app.run(function($rootScope, $location, $state) {

  $rootScope.$on( '$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

    $('.modal-backdrop.fade.in').hide();

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