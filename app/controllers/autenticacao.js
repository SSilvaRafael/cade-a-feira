var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    UsuariosFeira = mongoose.model('UsuariosFeira');
    Article = mongoose.model('Article'),

    jwt = require('jwt-simple'), 
    moment = require('moment'), 
    segredo = 'seusegredodetoken';

module.exports = function (app) {
  app.use('/', router);
};    
    
router.get("/cadastraUsuario", function(req, res, next){
	
	var user = new UsuariosFeira({
      email: 'teste1',
      senha: 'teste1'
  });

	//user.dadosAcesso.email = req.body.email;
    //user.dadosAcesso.senha = req.body.senha;
    
  user.save(function(err) {
         if (err)
            res.send(err);
         res.json({ message: 'Novo Usuário', user: user, email: user.email, senha: user.senha });    
    });       
});

router.get("/login", function(req, res, next){
	  //var email = req.body.email || '';
  	//var senha = req.body.senha || '';
    var email = 'teste1';
    var senha = 'teste1';

  	if (email == '' || senha == '') {
    	console.log('email ou senha, errado.');
      return res.send(401);
  	}
  	
    //1
  	 UsuariosFeira.findOne({email: email}, function (err, user) {
    	 if (err) {
      		return res.end(401)
    	 }

       if(user.senha != senha){
          console.log('Senha errada.');
          return res.send(401);
       }
        
      /*Criação do token.*/
      var expires = moment().add(7,'days').valueOf(); 
    	var token = jwt.encode({ // cria o token.
      		  iss: user.id,
      		  exp: expires
    	   }, segredo);
    
    	   //4
    	   return res.json({
    	     	token : token,
      		  expires: expires,
      		  user: user.toJSON()
     	    });
      
      });
  });
    



	
