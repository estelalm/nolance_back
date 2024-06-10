/*********************************************************************************************
 * Objetivo: Criação de um API para manipular dados de uma empresa de leilão online
 * Data: 21/05/2024
 * Autor: Maria Luiza Gomes de Almeida e Estela Alves
 * Versão: 1.0
*********************************************************************************************/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {request} = require('http')

const app = express()

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
    console.log(socket.id); 
  });

const {createPaymentIntent,confirmPayment} = require('./controller/controller_pagamento.js')

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const result = await confirmPayment(req.body, req.headers['stripe-signature'])

  res.send(result)
})

app.use(express.json())

app.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())

    next()
})

/*********************Import dos arquivos de controller do projeto*************************/
const controllerStatus = require('./controller/controller_status.js')
const controllerModalidade = require('./controller/controller_modalidade.js')
const controllerEndereco = require('./controller/controller_endereco.js')
const controllerSubcategorias = require('./controller/controller_subcategoria.js')
const controllerCategorias = require('./controller/controller_categoria.js')
const controllerUsuarios = require('./controller/controller_usuario.js')
const controllerFuncionarios = require('./controller/controller_funcionario.js')
const controllerInteresses = require('./controller/controller_interesse.js')
const controllerComitentes = require('./controller/controller_comitente.js')
const controllerLeiloes = require('./controller/controller_leilao.js')
const controllerLotes = require('./controller/controller_lote')
const controllerLances = require('./controller/controller_lance.js')
const controllerPagamentos = require('./controller/controller_pagamento.js')
const { log } = require('console')
/******************************************************************************************/

const bodyParserJSON = bodyParser.json()

/* STATUS - CRUD */

app.get('/v1/nolance/status', cors(), async function(request, response){
    let dados = await controllerStatus.getListarStatus()

    response.status(dados.status_code)
    response.json(dados)
})

app.put('/v1/nolance/status/:id', cors(), async function(request, response){
    let contentType = request.header('content-type')

    let id = request.params.id

    let dadosBody = request.body

    let resultDadosAtualizados = await controllerStatus.atualizarStatus(dadosBody, id, contentType )

    response.status(resultDadosAtualizados.status_code)
    response.json(resultDadosAtualizados)
})

app.delete('/v1/nolance/status/:id', cors(), async function(request, response){
    let id = request.params.id

    let statusExcluido = await controllerStatus.deletarStatus(id)

    response.status(statusExcluido.status_code)
    response.json(statusExcluido)
})

/* MODALIDADE - CRUD */

app.get('/v1/nolance/modalidade', cors(), async function(request, response){
    let dados = await controllerModalidade.listarTodasModalidades()

    response.status(dados.status_code)
    response.json(dados)
})

app.put('/v1/nolance/modalidade/:id', cors(), async function(request,response){
    let contentType = request.header('content-type')

    let id = request.params.id

    let dadosBody = request.body

    let resultDadosAtualizados = await controllerModalidade.atualizarModalidade(dadosBody, id, contentType )

    response.status(resultDadosAtualizados.status_code)
    response.json(resultDadosAtualizados)
})

app.delete('/v1/nolance/modalidade/:id', cors(), async function(request,response){
    let id = request.params.id

    let modalidadeExcluida = await controllerModalidade.deletarModalidade(id)

    response.status(modalidadeExcluida.status_code)
    response.json(modalidadeExcluida)
})

/* ENDEREÇO - CRUD */
app.get('/v1/nolance/endereco', cors(), async function(request, response){
    let dados = await controllerEndereco.getListarEnderecos()

    response.status(dados.status_code)
    response.json(dados)
})

app.put('/v1/nolance/endereco/:id', cors(), async function(request, response){
    let contentType = request.header('content-type')

    let id = request.params.id

    let dadosBody = request.body

    let resultDadosAtualizados = await controllerEndereco.atualizarEndereco(dadosBody, id, contentType )

    response.status(resultDadosAtualizados.status_code)
    response.json(resultDadosAtualizados)
})

app.post('/v1/nolance/endereco', cors(), async function (request, response){
    let contentType = request.header('content-type')

    let dadosBody = request.body

    let resultDadosNovoEndereco = await controllerEndereco.adicionarEndereco(dadosBody, contentType)

    response.status(resultDadosNovoEndereco.status_code)
    response.json(resultDadosNovoEndereco)
})

app.delete('/v1/nolance/endereco/:id', cors(), async function(request,response){
    let id = request.params.id

    let enderecoExcluido = await controllerEndereco.deletarEndereco(id)

    response.status(enderecoExcluido.status_code)
    response.json(enderecoExcluido)
})

//Endpoints: categorias
app.get('/v1/nolance/categorias', cors(), async (request, response, next) =>{

    let dadosCategorias = await controllerCategorias.getListarCategorias()

    response.status(dadosCategorias.status_code)
    response.json(dadosCategorias)

    next()

})

app.get('/v1/nolance/categoria/:id', cors(), async (request, response, next) =>{

    let idCategoria = request.params.id

    let dadosCategorias = await controllerCategorias.getBuscarCategoria(idCategoria)

    response.status(dadosCategorias.status_code)
    response.json(dadosCategorias)

    next()

})


app.post('/v1/nolance/categoria', cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosCategoria = await controllerCategorias.setInserirCategoria(dadosBody, contentType)

    response.status(resultDadosCategoria.status_code)
    response.json(resultDadosCategoria)

})

app.put('/v1/nolance/categoria/:id', cors(), bodyParserJSON, async (request, response, next) =>{

    let idCategoria = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosCategoria = await controllerCategorias.setAtualizarCategoria(idCategoria, dadosBody, contentType)

    response.status(resultDadosCategoria.status_code)
    response.json(resultDadosCategoria)

})

app.delete('/v1/nolance/categoria/:id', cors(), async (request, response, next) =>{

    let idCategoria = request.params.id

    let dadosCategorias = await controllerCategorias.setExcluirCategoria(idCategoria)

    response.status(dadosCategorias.status_code)
    response.json(dadosCategorias)


})


//Endpoints: subcategorias
app.get('/v1/nolance/subcategorias', cors(), async (request, response, next) =>{

    let dadosSubcategorias = await controllerSubcategorias.getListarSubcategorias()

    response.status(dadosSubcategorias.status_code)
    response.json(dadosSubcategorias)

    next()

})

app.get('/v1/nolance/subcategoria/:id', cors(), async (request, response, next) =>{

    let idSubcategoria = request.params.id

    let dadosSubcategorias = await controllerSubcategorias.getBuscarSubcategoria(idSubcategoria)

    response.status(dadosSubcategorias.status_code)
    response.json(dadosSubcategorias)

    next()

})

app.post('/v1/nolance/subcategoria', cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosSubcategoria = await controllerSubcategorias.setInserirSubcategoria(dadosBody, contentType)

    response.status(resultDadosSubcategoria.status_code)
    response.json(resultDadosSubcategoria)

})

app.put('/v1/nolance/subcategoria/:id', cors(), bodyParserJSON, async (request, response, next) =>{

    let idSubcategoria = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosSubcategoria = await controllerSubcategorias.setAtualizarSubcategoria(idSubcategoria, dadosBody, contentType)

    response.status(resultDadosSubcategoria.status_code)
    response.json(resultDadosSubcategoria)

})

app.delete('/v1/nolance/subcategoria/:id', cors(), async (request, response, next) =>{

    let idSubcategoria = request.params.id

    let dadosSubcategorias = await controllerSubcategorias.setExcluirSubcategoria(idSubcategoria)

    response.status(dadosSubcategorias.status_code)
    response.json(dadosSubcategorias)

})

/**********************************ENDPOINTS : USUÁRIOS *********************************************/

app.get('/v1/nolance/users', cors(), async (request, response) => {
    let usersData = await controllerUsuarios.listUsers()

    response.status(usersData.status_code)
    response.json(usersData)
})

app.get('/v1/nolance/user/:id', cors(), async (request, response) => {

    let id = request.params.id
    let usersData = await controllerUsuarios.listUserById(id)

    response.status(usersData.status_code)
    response.json(usersData)
})

app.get('/v1/nolance/user', cors(), async (request, response) => {

    let email = request.query.email
    let senha = request.query.senha
    let usersData = await controllerUsuarios.listUserByLogin(email, senha)

    response.status(usersData.status_code)
    response.json(usersData)
})


app.post('/v1/nolance/users', cors(), async (request, response) => {
    let contentType = request.header('content-type')

    let dadosBody = request.body

    let resultNewUserData = await controllerUsuarios.addUser(dadosBody, contentType)

    response.status(resultNewUserData.status_code)
    response.json(resultNewUserData)
})

app.put('/v1/nolance/user/:id', cors(), async (request, response) => {
    let userId = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body

    let resultUserData = await controllerUsuarios.updateUser(dadosBody, userId, contentType)

    response.status(resultUserData.status_code)
    response.json(resultUserData)
})

app.delete('/v1/nolance/user/:id', cors(), async (request, response, next) =>{

    let userId = request.params.id

    let userData = await controllerUsuarios.deleteUser(userId)

    response.status(userData.status_code)
    response.json(userData)

})

/**********************************ENDPOINTS : FUNCIONÁRIOS *********************************************/

app.get('/v1/nolance/employees', cors(), async (request, response) => {
    let employeesData = await controllerFuncionarios.listEmployees()

    response.status(employeesData.status_code)
    response.json(employeesData)
})

app.post('/v1/nolance/employees', cors(), async (request, response) => {
    let contentType = request.header('content-type')

    let dadosBody = request.body

    let resultNewEmployeeData = await controllerFuncionarios.addEmployee(dadosBody, contentType)

    response.status(resultNewEmployeeData.status_code)
    response.json(resultNewEmployeeData)
})

app.put('/v1/nolance/employee/:id', cors(), async (request, response) => {
    let employeeId = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body

    let resultEmployeeData = await controllerFuncionarios.updateEmployee(dadosBody, employeeId, contentType)

    response.status(resultEmployeeData.status_code)
    response.json(resultEmployeeData)
})

app.delete('/v1/nolance/employee/:id', cors(), async (request, response, next) =>{

    let employeeId = request.params.id

    let employeeData = await controllerFuncionarios.deleteEmployee(employeeId)

    response.status(employeeData.status_code)
    response.json(employeeData)

})


/**********************************ENDPOINTS : INTERESSES *********************************************/
app.get('/v1/nolance/interesses', cors(), async (request, response) => {
    let dadosInteresses = await controllerInteresses.listInteresses()

    response.status(dadosInteresses.status_code)
    response.json(dadosInteresses)
})

app.post('/v1/nolance/interesses', cors(), async (request, response) => {
    let contentType = request.header('content-type')

    let dadosBody = request.body

    let resultNewInterest = await controllerInteresses.addNewUserInterest(dadosBody, contentType)

    response.status(resultNewInterest.status_code)
    response.json(resultNewInterest)
})

app.put('/v1/nolance/interesse/:id', cors(), async (request, response) => {
    let interesseId = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body

    let resultInteresseDados = await controllerInteresses.updateInterest(dadosBody, contentType, interesseId)

    response.status(resultInteresseDados.status_code)
    response.json(resultInteresseDados)
})

/**********************************ENDPOINTS : COMITENTE *********************************************/

app.get('/v1/nolance/comitentes', cors(), async (request, response, next) =>{

    let dadosComitentes = await controllerComitentes.getListarComitentes()

    response.status(dadosComitentes.status_code)
    response.json(dadosComitentes)

    next()

})

app.get('/v1/nolance/comitente/:id', cors(), async (request, response, next) =>{

    let idComitente = request.params.id

    let dadosComitentes = await controllerComitentes.getBuscarComitente(idComitente)

    response.status(dadosComitentes.status_code)
    response.json(dadosComitentes)

    next()
})

app.post('/v1/nolance/comitente/fisico', cors(), bodyParserJSON, async (request, response, next) =>{
    let contentType = request.header('content-type')
    let dadosBody = request.body
   
    let resultDadosComitente = await controllerComitentes.setInserirComitenteFisico(dadosBody, contentType)

    response.status(resultDadosComitente.status_code)
    response.json(resultDadosComitente)
})
app.post('/v1/nolance/comitente/juridico', cors(), bodyParserJSON, async (request, response, next) =>{
    let contentType = request.header('content-type')
    let dadosBody = request.body
   
    let resultDadosComitente = await controllerComitentes.setInserirComitenteJuridico(dadosBody, contentType)

    response.status(resultDadosComitente.status_code)
    response.json(resultDadosComitente)
})


app.put('/v1/nolance/comitente/fisico/:id', cors(), bodyParserJSON, async (request, response, next) =>{

    let idComitente = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosComitente = await controllerComitentes.setAtualizarComitenteFisico(idComitente, dadosBody, contentType)

    response.status(resultDadosComitente.status_code)
    response.json(resultDadosComitente)

})

app.put('/v1/nolance/comitente/juridico/:id', cors(), bodyParserJSON, async (request, response, next) =>{

    let idComitente = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosComitente = await controllerComitentes.setAtualizarComitenteJuridico(idComitente, dadosBody, contentType)

    response.status(resultDadosComitente.status_code)
    response.json(resultDadosComitente)

})

app.delete('/v1/nolance/comitente/fisico/:id', cors(), async (request, response, next) =>{

    let idComitente= request.params.id

    let dadosComitentes = await controllerComitentes.setExcluirComitenteFisico(idComitente)

    response.status(dadosComitentes.status_code)
    response.json(dadosComitentes)

})
app.delete('/v1/nolance/comitente/juridico/:id', cors(), async (request, response, next) =>{

    let idComitente= request.params.id

    let dadosComitentes = await controllerComitentes.setExcluirComitenteJuridico(idComitente)

    response.status(dadosComitentes.status_code)
    response.json(dadosComitentes)

})

/**********************************ENDPOINTS : LEILÃO *********************************************/

app.get('/v1/nolance/leiloes', cors(), async function(request, response){
    let dadosLeiloes = await controllerLeiloes.listLeiloes()

    response.status(dadosLeiloes.status_code)
    response.json(dadosLeiloes)
})

app.get('/v1/nolance/leilao/:id', cors(), async function(request, response){
    let idLeilao = request.params.id

    let dadosLeilao = await controllerLeiloes.listLeilaoById(idLeilao)

    response.status(dadosLeilao.status_code)
    response.json(dadosLeilao)
})



app.post('/v1/nolance/leiloes', cors(), async function(request, response){
    let contentType = request.header('content-type')
    let dados = request.body
   
    let resultDadosLeilao = await controllerLeiloes.addLeilao(dados, contentType)

    response.status(resultDadosLeilao.status_code)
    response.json(resultDadosLeilao)
})

app.put('/v1/nolance/leilao/:id', cors(), async function(request, response) {

    let idLeilao = request.params.id

    let dados = request.body
    let contentType = request.header('content-type')

    let resultLeilao = await controllerLeiloes.updateLeilao(dados, contentType, idLeilao)

    response.status(resultLeilao.status_code)
    response.json(resultLeilao)
})

app.delete('/v1/nolance/leilao/:id', cors(), async function(request, response) {
    let idLeilao = request.params.id

    let resultLeilao = await controllerLeiloes.deleteLeilao(idLeilao)

    response.status(resultLeilao.status_code)
    response.json(resultLeilao)
})


/**********************************ENDPOINTS : LOTE *********************************************/

app.get('/v1/nolance/lotes', cors(), async (request, response, next) =>{

    let dadosLotes = await controllerLotes.getListarLotes()

    response.status(dadosLotes.status_code)
    response.json(dadosLotes)

    next()

})

app.get('/v1/nolance/lote/:id', cors(), async (request, response, next) =>{

    let idLote = request.params.id

    let dadosLotes = await controllerLotes.getBuscarLote(idLote)

    response.status(dadosLotes.status_code)
    response.json(dadosLotes)

    next()

})


app.post('/v1/nolance/lote', cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosLote = await controllerLotes.setInserirLote(dadosBody, contentType)

    response.status(resultDadosLote.status_code)
    response.json(resultDadosLote)

})

app.put('/v1/nolance/lote/:id', cors(), bodyParserJSON, async (request, response, next) =>{

    let idLote = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosLote = await controllerLotes.setAtualizarLote(idLote, dadosBody, contentType)

    response.status(resultDadosLote.status_code)
    response.json(resultDadosLote)

})

app.delete('/v1/nolance/lote/:id', cors(), async (request, response, next) =>{

    let idLote = request.params.id

    let dadosLotes = await controllerLotes.setExcluirLote(idLote)

    response.status(dadosLotes.status_code)
    response.json(dadosLotes)


})


/**********************************ENDPOINTS : LANCE *********************************************/

app.get('/v1/nolance/lances', cors(), async (request, response, next) =>{

    let dadosLances = await controllerLances.getListarLances()

    response.status(dadosLances.status_code)
    response.json(dadosLances)

    next()

})

app.get('/v1/nolance/lance/:id', cors(), async (request, response, next) =>{

    let idLance = request.params.id

    let dadosLances = await controllerLances.getBuscarLance(idLance)

    response.status(dadosLances.status_code)
    response.json(dadosLances)

    next()

})
app.get('/v1/nolance/lance/arremate/lote/:id', cors(), async (request, response, next) =>{

    let idLote = request.params.id

    let dadosLances = await controllerLances.getBuscarArrematante(idLote)

    response.status(dadosLances.status_code)
    response.json(dadosLances)

    next()

})
app.get('/v1/nolance/lance/arremate/usuario/:id', cors(), async (request, response, next) =>{

    let idUsuario = request.params.id

    let dadosLances = await controllerLances.getArrematesUsuario(idUsuario)

    response.status(dadosLances.status_code)
    response.json(dadosLances)

    next()

})

app.get('/v1/nolance/lances/filtro', cors(), async (request, response, next) =>{

    let params = request.query

    let dadosLances = await controllerLances.getFiltrarLance(params)

    response.status(dadosLances.status_code)
    response.json(dadosLances)

    next()

})



app.post('/v1/nolance/lance', cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosLance = await controllerLances.setInserirLance(dadosBody, contentType)

    response.status(resultDadosLance.status_code)
    response.json(resultDadosLance)

})

app.put('/v1/nolance/lance/:id', cors(), bodyParserJSON, async (request, response, next) =>{

    let idLance = request.params.id

    let contentType = request.header('content-type')
    let dadosBody = request.body
   

    let resultDadosLance = await controllerLances.setAtualizarLance(idLance, dadosBody, contentType)

    response.status(resultDadosLance.status_code)
    response.json(resultDadosLance)

})

app.delete('/v1/nolance/lance/:id', cors(), async (request, response, next) =>{

    let idLance = request.params.id

    let dadosLances = await controllerLances.setExcluirLance(idLance)

    response.status(dadosLances.status_code)
    response.json(dadosLances)


})

/**********************************ENDPOINTS : PAGAMENTOS *********************************************/

app.get('/v1/nolance/pagamentos', cors(), async function(request, response) {
    let paymentsData = await controllerPagamentos.listAllPayments()

    response.status(paymentsData.status_code)
    response.json(paymentsData)
})

app.post('/create-checkout-session/:id', async (req, res) => {
    let idLote = req.params.id

    const arrematante = await controllerLances.getBuscarArrematante(idLote)

    const result = await createPaymentIntent(arrematante, idLote)
   

    res.send(result)
})

httpServer.listen('8080', function(){
    console.log('API funcionando!')
})
// app.listen('8080', function(){
//     console.log('API funcionando!')
// })