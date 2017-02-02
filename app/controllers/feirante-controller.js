var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    UsuariosFeira = mongoose.model('UsuariosFeira');
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

/**
 * 
router.get('/testeMatheus', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Feirante Controller!',
      articles: articles
    });
  });
});
 * 
 * 
 */

router.get('/criar-barraca-feira', function(req, resp, next){

        localização = req.body.objeto.coordenadasFeira;
        barraca = req.body.objeto.informacoesBarraca;
        idUsuario = req.body.idUsuario;
        
        UsuariosFeira.update({_id: idUsuario },
            {$push: { 'feira.barraca' : barraca }}, 
                {upsert:true}, 
                    function(err, data) {
                        if(err) return next(err)
                        resp.send("Barraca cadastrada com sucesso.");
                    }
        ),
        function (erro){
            console.log(erro);
            console.log("erro ao criar a barraca");
            resp.send("não foi possivel a criacao da barraca");
        }
});

/**
 * LISTAGEMPRODUTOS!
 * rota responsavel por listagem dos produtos de um feirante!
 */
router.get('/meus-produtos/:idUsuario?', function(req, resp, next){
    
    var usuario = req.query.idUsuario;
    
     UsuariosFeira.findOne({_id: usuario},function(err, sucesso){
        if(err) return next (err)
        resp.format({
                    json: function(){
                        resp.json(sucesso.barraca.listaProdutos);
                    }
        });
     });

},function (err){
    
    console.log(err);
    resp.json({mensagem:"Não foi possível listar os produtos.", logErro: err});

});

/**
 * rota responsavel por cadastrar um produto de um feirante!
*/
router.get('/cadastra-produto/:idUsuario?/:produto?',function (req, resp, next){
    //aqui poderia ter verificacoes de campos nulo mas vamos fazer tudo no front-end
    //afim de reduzir o trabalho
    
     produto = req.query.produto;
     idUsuario = req.query.idUsuario;
    
     UsuariosFeira.update({_id: idUsuario },
         {$push: { 'barraca.listaProdutos' : produto }}, 
             {upsert:true}, 
                 function(err, sucesso) {
                     if(err) return next(err)
                     resp.json({mensagem:"Produto cadastrado com sucesso.", sucesso});
                 });
    
 }, function (erro){
         console.log(erro);
         console.log("erro ao cadastrar o produto");
         resp.json({detalheErro:"não foi possivel realizar o cadastro do produto."});
 });

/**
 * rota responsavel por atualizar um determinado produto de um feirante!
 */ 

router.get('/recuperar-produto/:idUsuario?/:produto?', function(req, resp, next){
    

    UsuariosFeira.findOne({_id: req.query.idUsuario, 'barraca.listaProdutos.nome': req.query.produto}, 
        function(err, sucesso){
            if (err) return next(err);
            console.log(sucesso);
            resp.json(sucesso.barraca.listaProdutos[0]);
        });

}, function(err){
    console.log(err);
    resp.json(err);
});


 router.get('/atualiza-produto/:idUsuario?/:produto?', function (req, resp, next){
     var detalhesAtualizacao = {};
     detalhesAtualizacao.idUsuario = req.query.idUsuario;
     detalhesAtualizacao.produto = req.query.produto;
     
     console.log(req.query.produto.nome);
     console.log(req.query.produto.preco);
     console.log(req.query.produto.descricaoProduto);
     console.log(req.query.produto.disponibilidadeDelivery);

     var listaProdutos = [];
     

      
     UsuariosFeira.update({_id: detalhesAtualizacao.idUsuario, 'barraca.listaProdutos.nome': req.query.produto.nome },
                        {'$set': {'barraca.listaProdutos.$.preco':req.query.produto.preco, 
                        'barraca.listaProdutos.$.descricaoProduto': req.query.produto.descricaoProduto,
                        'barraca.listaProdutos.$.disponibilidadeDelivery': req.query.produto.disponibilidadeDelivery}}, 
        function(err, sucesso) {
            if(err) return next(err)
            resp.json({mensagem:"Produto foi atualizado com sucesso", sucesso});
        }
     );
 }, function (erro){
         console.log(erro);
         resp.send({mensagem:"Não foi possível atualizar o produto.", erro});
 });

/**
 *  REMOCAO-PRODUTO
 */
router.all('/remove-produto/:idUsuario?/:nomeProduto?', function(req, resp, next){

     var detalhesRemocao = {};
     detalhesRemocao.idUsuario = req.query.idUsuario;
     detalhesRemocao.nomeProduto = req.query.nomeProduto;
     
     console.log("id usuario efetuando remocao: "+detalhesRemocao.idUsuario);
     console.log("Nome produto para remocao: "+detalhesRemocao.nomeProduto);
     
     UsuariosFeira.update({'_id': detalhesRemocao.idUsuario}, { $pull: { "barraca.listaProdutos" : { nome: detalhesRemocao.nomeProduto } } },
        function(err,sucesso){
            if(err) return next(err);
            resp.json(sucesso, {mensagem:"Produto removido com sucesso.", mensagemRedirecionamento:"Retornando para listagem de produtos"});
            resp.redirect("/meus-produtos/:idUsuario?"+detalhesRemocao.idUsuario);
            console.log(sucesso);
        });
}, function (err){
    resp.json({mensagem:"Não foi possivel remover o item."}, err);
    console.log(err);
});

