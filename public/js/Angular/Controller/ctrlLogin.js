app.controller('loginCtrl', 
  ['$scope', 
  'loginApi', 
  '$location', 
  '$state', 
  'notify',
  'FBLogin',
  'GoogleLogin',
  function($sp, loginApi, $location, $state, notify, FbAuth, GGLogin){

    $sp.cargandoRegistro = false;
    if(window.localStorage.getItem('token') && window.localStorage.getItem('usuario')){
      $state.go('home.dashboard');
    }

    $sp.login = function(user){
      $sp.cargandoLogin = true;
      console.log(user);
      loginApi.login(user).then( function(resp){
        var data = resp.data;

        window.localStorage.setItem('token', data.token); 
        window.localStorage.setItem('usuario', JSON.stringify(data.usuario));         

        $state.go('home.dashboard');
        cargandoLogin =false;
      }, function (err) {
        notify({
          message: 'El usuario o contraseña no son validos.',
          duration: 10000,
          classes: 'alert-danger',
          position : 'center'
        });
        cargandoLogin =false;
      });
    };

    $sp.signup = function(user){
      $sp.cargandoRegistro = true;
      loginApi.signup(user).then( function(resp){
        notify({
          message: 'Su registro se ha realizado con éxito, le hemos enviado un email para que valida su cuenta.',
          duration: 10000,
          classes: 'alert-success',
          position : 'center'
        });
        $sp.userR = {};
        $sp.cargandoRegistro = false;
      },function(err){
        notify({
          message: 'Ha ocurrido un error al registrar su cuenta, compruebe los datos e intente nuevamente.',
          duration: 100000,
          classes: 'alert-danger',
          position : 'center'
        });
        $sp.cargandoRegistro = false;
      });
    };


    $sp.FBLogin = function () {
      FbAuth.Login($sp.login);
    };

    $sp.GoogleLogin = function () {
      GGLogin.Login($sp.login);
    };

    /*
      var scopesFB = 'email, user_friends, public_profile';

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1761122240880256',
        xfbml      : true,
        cookie     : true,
        status     : true,
        version    : 'v2.8'
      });

      function estado() {
        FB.getLoginStatus( function (resp) {
          if (resp.status === 'connect'){
            console.log('conetado')
          } else {
            console.log('No conectado');
          }
        });
      }

      $sp.FBLogout = function(next){
        FB.getLoginStatus(function(response) {
          if (response && response.status === 'connected') {
            FB.logout(function(response) {
              console.log(response);
              next();
            });
          }
        });
      };

      $sp.FBLogin = function(){
        FB.login( function (resp) {          
          if (resp.authResponse) {
            FB.api('/me', {fields: 'name, email'}, function (response) {
              var user = {
                proveedor: 'FB',
                idProveedor: response.id,
                nombre : response.name,
                email : response.email
              };
              $sp.login(user);
            });
          } else {
            console.log('entre al else');
          }
        } ,{ 
          scope : scopesFB,
          return_scopes: true
        });
      };
    };
    */

  }]);