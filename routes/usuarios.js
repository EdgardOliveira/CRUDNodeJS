var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// R - Listar todos os registros de usuarios
router.get('/', function(req, res, next) {

    // read query
    dbConn.query('SELECT * FROM usuarios ORDER BY id desc',function(err,rows)     {

        if(err) {
            req.flash('error', err);
            // renderiza para a página views/usuarios/index.ejs
            res.render('usuarios',{data:''});
        } else {
            // renderiza para a página views/usuarios/index.ejs
            res.render('usuarios',{data:rows});
        }
    });
});

// Exibir a página de cadastrar usuario
router.get('/add', function(req, res, next) {
    // renderiza para add.ejs
    res.render('usuarios/add', {
        nome: '',
        email: '',
        senha: ''
    })
})

// C - Cadastra um novo usuario
router.post('/add', function(req, res, next) {

    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;
    let errors = false;

    if(nome.length === 0 || email.length === 0 || senha.length === 0) {
        errors = true;

        // exibe o erro na página
        req.flash('error', "Preencha todos os dados");
        // renderiza a página add.ejs
        res.render('usuarios/add', {
            nome: nome,
            email: email,
            senha: senha
        })
    }

    // Se não houver erros
    if(!errors) {

        var form_data = {
            nome: nome,
            email: email,
            senha: senha
        }

        // insert query
        dbConn.query('INSERT INTO usuarios SET ?', form_data, function(err, result) {
            //se der erro
            if (err) {
                //exibe o erro na página
                req.flash('error', err)

                // renderiza a página para add.ejs
                res.render('usuarios/add', {
                    nome: form_data.nome,
                    email: form_data.email,
                    senha: form_data.senha
                })
            } else {
                req.flash('success', 'Registro cadastrado com sucesso!');
                res.redirect('/usuarios');
            }
        })
    }
})

// Exibir a página de atualizar usuario
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM usuarios WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // se o usuario não for encontrado
        if (rows.length <= 0) {
            req.flash('error', 'Registro com o id = ' + id + ' não foi encontrado!')
            res.redirect('/usuarios')
        }
        // se o usuario for encontrado
        else {
            // renderiza a pagina  edit.ejs
            res.render('usuarios/edit', {
                title: 'Editar usuario',
                id: rows[0].id,
                nome: rows[0].nome,
                email: rows[0].email,
                senha: rows[0].senha
            })
        }
    })
})

// U - Atualizar os dados do usuario
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;
    let errors = false;

    if(nome.length === 0 || email.length === 0 || senha.length === 0) {
        errors = true;

        // exibe o erro na página
        req.flash('error', "Preencha todos os campos!");
        // renderiza para a página de cadastro add.ejs
        res.render('usuarios/edit', {
            id: req.params.id,
            nome: nome,
            email: email,
            senha: senha
        })
    }

    // se não houver erros
    if( !errors ) {

        var form_data = {
            nome: nome,
            email: email,
            senha: senha
        }
        // update query
        dbConn.query('UPDATE usuarios SET ? WHERE id = ' + id, form_data, function(err, result) {
            //se der erro
            if (err) {
                // exibe o erro na página
                req.flash('error', err)
                // renderiza a página edit.ejs
                res.render('usuarios/edit', {
                    id: req.params.id,
                    nome: form_data.nome,
                    email: form_data.email,
                    senha: form_data.senha
                })
            } else {
                req.flash('success', 'Registro com id = ' + id + ' atualizado!');
                res.redirect('/usuarios');
            }
        })
    }
})

// D - Excluir um usuario
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM usuarios WHERE id = ' + id, function(err, result) {
        //se der erro
        if (err) {
            // exibe o erro na página
            req.flash('error', err)
            // redirect to usuarios page
            res.redirect('/usuarios')
        } else {
            // exibe o erro na página
            req.flash('success', 'Registro com id = ' + id + ' excluído com sucesso!')
            // redirect to usuarios page
            res.redirect('/usuarios')
        }
    })
})

module.exports = router;