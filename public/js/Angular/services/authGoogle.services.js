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