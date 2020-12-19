var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// R - Listar todos os registros de clientes
router.get('/', function(req, res, next) {

    // read query
    dbConn.query('SELECT * FROM clientes ORDER BY id desc',function(err,rows)     {

        if(err) {
            req.flash('error', err);
            // renderiza para a página views/clientes/index.ejs
            res.render('clientes',{data:''});
        } else {
            // renderiza para a página views/clientes/index.ejs
            res.render('clientes',{data:rows});
        }
    });
});

// Exibir a página de cadastrar cliente
router.get('/add', function(req, res, next) {
    // renderiza para add.ejs
    res.render('clientes/add', {
        nome: '',
        cpf_cnpj: '',
        contato: '',
        celular: '',
        email: ''
    })
})

// C - Cadastra um novo cliente
router.post('/add', function(req, res, next) {

    let nome = req.body.nome;
    let cpf_cnpj = req.body.cpf_cnpj;
    let contato = req.body.contato;
    let celular = req.body.celular;
    let email = req.body.email;
    let errors = false;

    if(nome.length === 0 || contato.length === 0 || celular.length === 0 || email.length === 0) {
        errors = true;

        // exibe o erro na página
        req.flash('error', "Preencha todos os dados");
        // renderiza a página add.ejs
        res.render('clientes/add', {
            nome: nome,
            cpf_cnpj: cpf_cnpj,
            contato: contato,
            celular: celular,
            email: email
        })
    }

    // Se não houver erros
    if(!errors) {

        var form_data = {
            nome: nome,
            cpf_cnpj: cpf_cnpj,
            contato: contato,
            celular: celular,
            email: email
        }

        // insert query
        dbConn.query('INSERT INTO clientes SET ?', form_data, function(err, result) {
            //se der erro
            if (err) {
                //exibe o erro na página
                req.flash('error', err)

                // renderiza a página para add.ejs
                res.render('clientes/add', {
                    nome: form_data.nome,
                    cpf_cnpj: form_data.cpf_cnpj,
                    contato: form_data.contato,
                    celular: form_data.celular,
                    email: form_data.email
                })
            } else {
                req.flash('success', 'Registro cadastrado com sucesso!');
                res.redirect('/clientes');
            }
        })
    }
})

// Exibir a página de atualizar cliente
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM clientes WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // se o cliente não for encontrado
        if (rows.length <= 0) {
            req.flash('error', 'Registro com o id = ' + id + ' não foi encontrado!')
            res.redirect('/clientes')
        }
        // se o cliente for encontrado
        else {
            // renderiza a pagina  edit.ejs
            res.render('clientes/edit', {
                title: 'Editar cliente',
                id: rows[0].id,
                nome: rows[0].nome,
                cpf_cnpj: rows[0].cpf_cnpj,
                contato: rows[0].contato,
                celular: rows[0].celular,
                email: rows[0].email
            })
        }
    })
})

// U - Atualizar os dados do cliente
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nome = req.body.nome;
    let cpf_cnpj = req.body.cpf_cnpj;
    let contato = req.body.contato;
    let celular = req.body.celular;
    let email = req.body.email;
    let errors = false;

    if(nome.length === 0 || cpf_cnpj.length === 0 || contato.length === 0 || celular.length === 0 || email.length === 0) {
        errors = true;

        // exibe o erro na página
        req.flash('error', "Preencha todos os campos!");
        // renderiza para a página de cadastro add.ejs
        res.render('clientes/edit', {
            id: req.params.id,
            nome: nome,
            cpf_cnpj: cpf_cnpj,
            contato: contato,
            celular: celular,
            email: email
        })
    }

    // se não houver erros
    if( !errors ) {

        var form_data = {
            nome: nome,
            cpf_cnpj: cpf_cnpj,
            contato: contato,
            celular: celular,
            email: email
        }
        // update query
        dbConn.query('UPDATE clientes SET ? WHERE id = ' + id, form_data, function(err, result) {
            //se der erro
            if (err) {
                // exibe o erro na página
                req.flash('error', err)
                // renderiza a página edit.ejs
                res.render('clientes/edit', {
                    id: req.params.id,
                    nome: form_data.nome,
                    cpf_cnpj: form_data.cpf_cnpj,
                    contato: form_data.contato,
                    celular: form_data.celular,
                    email: form_data.email
                })
            } else {
                req.flash('success', 'Registro com id = ' + id + ' atualizado!');
                res.redirect('/clientes');
            }
        })
    }
})

// D - Excluir um cliente
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM clientes WHERE id = ' + id, function(err, result) {
        //se der erro
        if (err) {
            // exibe o erro na página
            req.flash('error', err)
            // redirect to clientes page
            res.redirect('/clientes')
        } else {
            // exibe o erro na página
            req.flash('success', 'Registro com id = ' + id + ' excluído com sucesso!')
            // redirect to clientes page
            res.redirect('/clientes')
        }
    })
})

module.exports = router;