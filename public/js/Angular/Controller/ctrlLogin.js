app.controller('loginCtrl', 
  ['$scope', 
  'loginApi', 
  '$location', 
  '$state', 
  'notify',
  'FBLogin',
  'GoogleLogin',
  function($sp, loginApi, $location, $state, notify, FBLogin, GGLogin){

    $sp.cargandoRegistro = false;
    if(window.localStorage.getItem('token') && window.localStorage.getItem('usuario')){
      $state.go('home.dashboard');
    }

    $sp.login = function(user){
      $sp.loadLogin = true;
      console.log(user);
      loginApi.login(user).then( function(resp){
        var data = resp.data;

        window.localStorage.setItem('token', data.token); 
        window.localStorage.setItem('usuario', JSON.stringify(data.usuario));         

        $state.go('home.dashboard');
        loadLogin =false;
      }, function (err) {
        notify({
          message: 'El usuario o contraseña no son validos.',
          duration: 10000,
          classes: 'alert-danger',
          position : 'center'
        });
        loadLogin =false;
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
      console.log('login facebook');
      FBLogin.Login($sp.login);
    };

    $sp.GoogleLogin = function () {
      GGLogin.Login($sp.login);
    };


  }]);