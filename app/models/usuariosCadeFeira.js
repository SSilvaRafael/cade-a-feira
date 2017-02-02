var bcrypt = require('bcrypt-nodejs');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsuariosFeiraSchema = new Schema({
	"dadosAcesso" : {
		"email" : String,
		"senha" : String,
		"perfil" : String,
	},
	"dadosPessoais" : {
		"nome" : String,
		"sobrenome" : String,
		"rg" : Number,
		"fotoUsuario" : String,
		"dataNascimento" : Date
	},
	"enderecoCliente" : {
		"rua" : String,
		"bairro" : String,
		"numero" : Number,
		"cep" : Number,
		"cidade" : String,
		"estado" : String,
		"complemento" : String
	},
	"barraca" :{
		"nome" : String,
		"descricao" : String,
		"fotoBarraca" : String,
		"listaProdutos" : [{
			"nome" : String,
			"preco" : String,
			"descricaoProduto" : String,
			"disponibilidadeDelivery": String,
			"foto" : String
		}],
		"feira" : {
			"localização" : {
				"endereco" : String,
				"cidade" : String,
				"coordinates" : [],
				"type" : String
			}
		}
	}
		
});

/*
UsuariosFeiraSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('senha')) return next();// isModield verifica se a senha não foi alterada.
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.senha, salt, null, function(err, hash) {
      if (err) return next(err);
      user.senha = hash;
      next();
    });
  });
});


UsuariosFeiraSchema.methods.verificaSenha = function(senha, next) {
  bcrypt.compare(senha, this.senha, function(err, isMatch) {
    if (err) return next(err);
    next(isMatch);
  });
};
*/

var collectionName = 'usuariosCadeFeira';
mongoose.model('UsuariosFeira', UsuariosFeiraSchema, collectionName);