/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'lotes'.
 * Data: 21/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

const lotesDAO = require('../model/DAO/lote.js')
const controllerSubcategorias= require('../controller/controller_subcategoria.js')
const controllerLeilao = require('../controller/controller_leilao.js')
const controllerStatus = require('../controller/controller_status.js')
const message = require('../module/config.js')

const getListarLotes = async function () {

    try {

        let lotesJSON = {}

        let dadosLotes = await lotesDAO.selectAllLotes()

        await Promise.all(dadosLotes.map(async lote =>{
            let statusLote = await controllerStatus.getListarStatusById(lote.status)
            lote.status = statusLote.status
        }))
        await Promise.all(dadosLotes.map(async lote =>{
            let subcategoriaLote = await controllerSubcategorias.getBuscarSubcategoriasByLote(lote.id)
            lote.subcategoria = subcategoriaLote.subcategorias
        }))

        await Promise.all(dadosLotes.map(async lote =>{
            let imagensLote = await lotesDAO.selectImagemLote(lote.id)
            lote.imagens = imagensLote
        }))

        if (dadosLotes) {
            if (dadosLotes.length > 0) {
                lotesJSON.lotes = dadosLotes
                lotesJSON.quantidade = dadosLotes.length
                lotesJSON.status_code = 200

                return lotesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBuscarLote = async function (id) {

    let idLote = id

    try {

        if (idLote == undefined || isNaN(idLote) || idLote == "") {
            return message.ERROR_INVALID_ID
        } else {
            let loteJSON = {}

            let dadosLote = await lotesDAO.selectLoteById(idLote)

            
            await Promise.all(dadosLote.map(async lote =>{
                let statusLote = await controllerStatus.getListarStatusById(lote.status)
                lote.status = statusLote.status
            }))
            await Promise.all(dadosLote.map(async lote =>{
                let subcategoriaLote = await controllerSubcategorias.getBuscarSubcategoriasByLote(lote.id)
                lote.subcategoria = subcategoriaLote.subcategorias
            }))
            await Promise.all(dadosLote.map(async lote =>{
                let imagensLote = await lotesDAO.selectImagemLote(lote.id)
                lote.imagens = imagensLote
            }))


            if (dadosLote) {
                if (dadosLote.length > 0) {
                    loteJSON.lote = dadosLote
                    loteJSON.status_code = 200

                    return loteJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}


const setInserirLote = async function (dadosBody, contentType) {

    let dadosLote = dadosBody

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let novoLoteJSON = {}

            if (dadosLote.nome == "" || dadosLote.nome == undefined || dadosLote.nome == null || dadosLote.nome.length > 45 ||
                dadosLote.data_inicio == "" || dadosLote.data_inicio == undefined || dadosLote.data_inicio == null || dadosLote.data_inicio.length > 10 ||
                dadosLote.descricao == "" || dadosLote.descricao == undefined || dadosLote.descricao == null || 
                dadosLote.reserva == "" || dadosLote.reserva == undefined || dadosLote.reserva == null || isNaN(dadosLote.reserva) ||
                dadosLote.status == "" || dadosLote.status == undefined || dadosLote.status == null || isNaN(dadosLote.status) ||
                dadosLote.leilao == "" || dadosLote.leilao == undefined || dadosLote.leilao == null || isNaN(dadosLote.leilao) 
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let novoLote = await lotesDAO.insertLote(dadosLote)
                let novoLoteId = await lotesDAO.selectLastInsertId()

                let novaCategoriaLote
                dadosLote.categoria.forEach(async categoria =>{
                    novaCategoriaLote = await lotesDAO.insertCategoriaLote(categoria, novoLoteId)
                })
                let novaImagemLote
                dadosLote.imagens.forEach(async url =>{
                    novaImagemLote = await lotesDAO.insertImageLote(url, novoLoteId)
                    console.log(novaImagemLote)
                })
                let dadosNovoLote = await getBuscarLote(novoLoteId)

                if (novoLote) {
                    novoLoteJSON.lote = dadosNovoLote.lote
                    novoLoteJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    novoLoteJSON.status = message.SUCCESS_CREATED_ITEM.status
                    novoLoteJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return novoLoteJSON

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

const setAtualizarLote = async function (id, dadosBody, contentType) {

    let dadosLote = dadosBody
    let idLote = id

    
    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            if (idLote == undefined || isNaN(idLote) || idLote == "") {
                return message.ERROR_INVALID_ID
            } else {

                let loteAtualizadaJSON = {}

                if (dadosLote.nome == "" || dadosLote.nome == undefined || dadosLote.nome == null || dadosLote.nome.length > 45 ||
                dadosLote.data_inicio == "" || dadosLote.data_inicio == undefined || dadosLote.data_inicio == null || dadosLote.data_inicio.length > 10 ||
                dadosLote.descricao == "" || dadosLote.descricao == undefined || dadosLote.descricao == null || 
                dadosLote.reserva == "" || dadosLote.reserva == undefined || dadosLote.reserva == null || isNaN(dadosLote.reserva) ||
                dadosLote.status == "" || dadosLote.status == undefined || dadosLote.status == null || isNaN(dadosLote.status) ||
                dadosLote.leilao == "" || dadosLote.leilao == undefined || dadosLote.leilao == null || isNaN(dadosLote.leilao)  ) {

                    return message.ERROR_REQUIRED_FIELDS
                } else {

                    //consertar caso não exista nenhuma subcategoria ou esteja adicionando mais do que já tem
                    let categoriasAntigas = await controllerSubcategorias.getBuscarSubcategoriasByLote(idLote)
                    let count = 0
                    let subcategoriaAtualizada
                    categoriasAntigas.subcategorias.forEach(async categoriaAntiga =>{
                        subcategoriaAtualizada = await lotesDAO.updateCategoriaLote(dadosLote.categoria[count], categoriaAntiga.id, idLote)
                        count ++
                    })

                    let loteAtualizada = await lotesDAO.updateLote(dadosBody, idLote)


                    // let dadosLoteAtualizado = await getBuscarLote(idLote)

                    if (loteAtualizada) {
                        // loteAtualizadaJSON.lote = dadosLoteAtualizado.lote
                        loteAtualizadaJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        loteAtualizadaJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        loteAtualizadaJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return loteAtualizadaJSON

                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
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

const setExcluirLote = async function (id) {

    let idLote = id

    try {

        if (idLote == undefined || isNaN(idLote) || idLote == "") {
            return message.ERROR_INVALID_ID
        } else {
            let loteExcluidaJSON = {}

            let dadosLoteExcluida = await lotesDAO.deleteLote(idLote)

            if (dadosLoteExcluida) {
                loteExcluidaJSON.status_code = message.SUCCESS_DELETED_ITEM.status_code
                loteExcluidaJSON.status = message.SUCCESS_DELETED_ITEM.status
                loteExcluidaJSON.message = message.SUCCESS_DELETED_ITEM.message

                    return loteExcluidaJSON
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    getListarLotes,
    getBuscarLote,
    setInserirLote,
    setAtualizarLote,
    setExcluirLote
}