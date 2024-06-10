const message = require('../module/config.js')

const usuarioDAO = require('../model/DAO/usuario.js')
const categoriasDAO = require('../model/DAO/categoria.js')
const interesseDAO = require('../model/DAO/interesse.js')
const controllerEndereco = require('./controller_endereco.js')

const listUsers = async () => {
    let usersJSON = {}

    let usersData = await usuarioDAO.selectAllUsers()

    if(usersData){
        if(usersData.length > 0){

            for(let i = 0; i < usersData.length ; i++){
                let user = usersData[i]
                let dadosInteresses = []
                let interesses = await interesseDAO.selectInterestByUserId(user.id)

                for(let contador = 0; contador < interesses.length; contador++){
                    let interesse = interesses[contador]
                    delete interesses.usuario_id

                    let dadosCategoria = await categoriasDAO.selectCategoriaById(interesse.categoria_id)

                    dadosInteresses.push(dadosCategoria)

                    user.interesses = dadosInteresses
                }
        
            }

            usersJSON.usuarios = usersData
            usersJSON.quantidade = usersData.length
            usersJSON.status_code = 200;

            return usersJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}
const listUserById = async (id) => {

    try{
        let usersJSON = {}

        let usersData = await usuarioDAO.selectByIdUser(id)
    
        if(usersData){
            if(usersData.length > 0){
    
                for(let i = 0; i < usersData.length ; i++){
                    let user = usersData[i]
                    let dadosInteresses = []
                    let interesses = await interesseDAO.selectInterestByUserId(id)
    
                    for(let contador = 0; contador < interesses.length; contador++){
                        let interesse = interesses[contador]
                        delete interesses.usuario_id
    
                        let dadosCategoria = await categoriasDAO.selectCategoriaById(interesse.categoria_id)
    
                        dadosInteresses.push(dadosCategoria)
    
                        user.interesses = dadosInteresses
                    }
            
                }
    
                usersJSON.usuario = usersData
                usersJSON.status_code = 200;
    
                return usersJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }catch(error){
        return message.ERROR_INTERNAL_SERVER
    }

}
const listUserByLogin = async (email, senha) => {
    let usersJSON = {}

    let usersData = await usuarioDAO.selectByLoginUser(email, senha)

    if(usersData){
        if(usersData.length > 0){

            for(let i = 0; i < usersData.length ; i++){
                let user = usersData[i]
                let dadosInteresses = []
                let interesses = await interesseDAO.selectInterestByUserId(user.id)

                for(let contador = 0; contador < interesses.length; contador++){
                    let interesse = interesses[contador]
                    delete interesses.usuario_id

                    let dadosCategoria = await categoriasDAO.selectCategoriaById(interesse.categoria_id)

                    dadosInteresses.push(dadosCategoria)

                    user.interesses = dadosInteresses
                }
        
            }

            usersJSON.usuario = usersData
            usersJSON.status_code = 200;

            return usersJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const addUser = async (dados, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let newUserJSON = {}

            if (dados.nome == '' || dados.nome == undefined || dados.nome == null || dados.nome.length > 100 ||
                dados.email == ''|| dados.email == undefined|| dados.email == null || dados.email.length > 45 ||
                dados.senha == '' || dados.senha == undefined || dados.senha == null || dados.senha.length >45 ||
                dados.telefone == ''|| dados.telefone == undefined || dados.telefone == null || dados.telefone.length > 11||
                dados.icone == '' || dados.icone == undefined || dados.icone == null || dados.icone.length > 200 ||
                dados.data_nascimento == ''|| dados.data_nascimento == undefined || dados.data_nascimento == null || dados.data_nascimento.length > 10 ||
                dados.cpf == '' || dados.cpf == undefined || dados.cpf == null || dados.cpf.length > 11
                // ||dados.endereco_id == '' || dados.endereco_id == undefined || dados.endereco_id == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let dadosEndereco = {
                    cep: dados.cep,
                    numero: dados.numero
                }
                let newAddress = await controllerEndereco.adicionarEndereco(dadosEndereco, contentType)
                dados.endereco_id = newAddress.endereco.id
                let newUser = await usuarioDAO.insertNewUser(dados)

                let id = await usuarioDAO.selectLastId()

                if (newUser) {
                    dados.id = id[0].id
                    newUserJSON.usuario = dados
                    newUserJSON.status = message.SUCCESS_CREATED_ITEM.status
                    newUserJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    newUserJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return newUserJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB 
                }

            }
        } else {
            return message.ERROR_CONTENT_TYPE 
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const updateUser = async (dados, id , contentType) => {

    try {
        if(String(contentType).toLowerCase() == 'application/json'){
            let updatedUserJSON = {}

            if(id == '' || id == undefined || isNaN(id) || 
                dados.nome == '' || dados.nome == undefined || dados.nome == null || dados.nome.length > 100 ||
                dados.email == ''|| dados.email == undefined|| dados.email == null || dados.email.length > 45 ||
                dados.senha == '' || dados.senha == undefined || dados.senha == null || dados.senha.length >45 ||
                dados.telefone == ''|| dados.telefone == undefined || dados.telefone == null || dados.telefone.length > 11||
                dados.icone == '' || dados.icone == undefined || dados.icone == null || dados.icone.length > 200 ||
                dados.data_nascimento == ''|| dados.data_nascimento == undefined || dados.data_nascimento == null || dados.data_nascimento.length > 10 ||
                dados.cpf == '' || dados.cpf == undefined || dados.cpf == null || dados.cpf.length > 11||
                dados.endereco_id == '' || dados.endereco_id == undefined || dados.endereco_id == null)
                {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let userId = await usuarioDAO.selectByIdUser(id)

                if (userId.length > 0) {
                    let updatedUser = await usuarioDAO.updateUser(dados, id)
                    if (updatedUser) {
                        updatedUserJSON.usuarioAtualizado = dados
                        updatedUser.status = message.SUCCESS_UPDATED_ITEM.status
                        updatedUserJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        updatedUserJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return message.SUCCESS_UPDATED_ITEM
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }

                } else {
                    return message.ERROR_NOT_FOUND
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const deleteUser = async (id) => {
    try {
        let userId = id

        if (userId == '' || userId == undefined || isNaN(userId)) {
            return message.ERROR_INVALID_ID
        } else {
            let user = await usuarioDAO.selectByIdUser(userId)

            if (user.length > 0) {
                let deletedUser = await usuarioDAO.deleteUser(userId)
                if (deletedUser) {
                    return message.SUCCESS_DELETED_ITEM
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            } else {
                return message.ERROR_NOT_FOUND
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports ={
    listUsers,
    listUserById,
    listUserByLogin,
    addUser,
    updateUser,
    deleteUser
}