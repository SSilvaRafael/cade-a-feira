var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    UsuariosFeira = mongoose.model('UsuariosFeira'),
    Article = mongoose.model('Article');
    
  module.exports = function (app) {
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });
  app.use('/', router);
};



router.get("/autenticaConsumidor/:email?/:senha?", function(req, res, next){
    var email = req.query.email;
    var senha = req.query.senha;
    
    console.log('Dados capturados:' + email + ' ' + senha);

    
    if (email == '' || senha == '') {
      console.log('email ou senha, errado.');
      return res.send(401);
    }
    
    
     UsuariosFeira.findOne({email: email}, function (err, user) {
      
       if (err) {
          return res.end(401)
       }

      
      console.log(user);
      
       if(user.senha != senha){
          console.log('Senha errada.');
          return res.send(401);
       }
      
       /*   
      //Criação do token.
      var expires = moment().add(7,'days').valueOf(); 
      var token = jwt.encode({ // cria o token.
            iss: user.id,
            exp: expires
         }, segredo);
    
      return res.json({
         token : token,
         expires: expires,
         user: user.toJSON()
      });
    */  
    
    console.log("Usuario: " + user.id);
    return user.id;  
  });
});
    




router.get('/cadastraConsumidor', function (req, res, next) {
  
    var user = new UsuariosFeira({
      email: 'rafael',
      senha: 'senha',
      perfil: 'CONSUMIDOR',

      nome: 'nome',
      sobrenome: 'sobrenome',
      rg : 'rg',
      fotoUsuario:  null,
      dataNascimento: null   
    });


    
    user.save(function(err) {
         if (err)
            res.send(err);
         res.json({ message: 'Novo Usuário', user: user, email: user.email, senha: user.senha,
                              perfil: user.perfil,

          });    
    });
});






/*A consulta será feita pelo email, logo, não podera ocorrer de dois usuários ter o e-mail igual.*/
//module.exports = app => {
  router.get('/consultaConsumidor', function(req, res, next){
     //const jwt = app.controllers.validarJWT;
      UsuariosFeira.findOne({id: user.id}, function (err, user) {
          if (err) {
            return res.end(401)
          }
          return user.id;
      });
  });  

  router.get('/removeConsumidor/', function(req, res, next){
      UsuariosFeira.remove({id: user.id}, function(err,user) {
          if (err) {
            return res.end(401)
          }
      });
  });  

  router.get('/atualizaConsumidor', function(req, res, next){
     UsuariosFeira.update({ email: user.email , senha: user.senha, nome: user.nome, sobrenome: user.sobrenome, 
        rg: user.rg, fotoUsuario: user.fotoUsuario, dataNascimento: user.dataNascimento}, function(err, user){
          if (err) {
              return res.end(401)
          }
          return user.id;
        });
  });


