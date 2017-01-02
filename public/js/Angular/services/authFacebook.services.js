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
  };

  var Conectado = function ( next ){
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
    Conectado(function (conectado) {
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
        console.log('entre al else del login')
        FB.api('/me', {fields: 'name, email'}, function (response) {
          var user = {
            proveedor: 'FB',
            idProveedor: response.id,
            nombre : response.name,
            email : response.email,
            imagen : 'https://graph.facebook.com/'+response.id+'/picture?type=large'
          };
          next(user);
        });
      }
    });  
  };
});