const message = require('../module/config.js')
const leiloesDAO = require('../model/DAO/leilao.js')
const categoriasDAO = require('../model/DAO/categoria.js')
const modalidadesDAO = require('../model/DAO/modalidade.js')
const comitentesDAO = require('../model/DAO/comitente.js')
const loteDAO = require('../model/DAO/lote.js')
const statusDAO = require('../model/DAO/status.js')

const listLeiloes = async function () {
    try {
        let leiloesJSON = {}
        let leiloesArray = []

        let dadosLeiloes = await leiloesDAO.selectAllLeiloes()

        for (let i = 0; i < dadosLeiloes.length; i++) {
            const leilao = dadosLeiloes[i];

            let dadosCategoria = await categoriasDAO.selectCategoriaById(leilao.categoria_id)

            let dadosModalidade = await modalidadesDAO.selectByIdModalidade(leilao.modalidade_id)

            let dadosComitente = await comitentesDAO.selectComitenteById(leilao.comitente_id)

            let lotes = await loteDAO.selectLotesByLeilao(leilao.id)

            for (let i = 0; i < lotes.length; i++) {
                const lote = lotes[i];

                let dadosStatus = await statusDAO.selectByIdStatus(lote.status_id)

                delete lote.status_id
                lote.status = dadosStatus
                
            }

            
            leilao.lotes = lotes

            delete leilao.categoria_id
            leilao.categoria = dadosCategoria

            delete leilao.modalidade_id
            leilao.modalidade = dadosModalidade

            delete leilao.comitente_id
            leilao.comitente = dadosComitente

            leiloesArray.push(leilao)

        }

        leiloesJSON.leiloes = leiloesArray
        leiloesJSON.quantidade = leiloesArray.length
        leiloesJSON.status_code = 200

        return leiloesJSON
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const listLeilaoById = async (id) => {
    try {
        let leilaoJSON = {}

        let dadosLeilao = await leiloesDAO.selectByIdLeilao(id)

        if (dadosLeilao) {

            let dadosCategoria = await categoriasDAO.selectCategoriaById(dadosLeilao[0].categoria_id)
   
            let dadosModalidade = await modalidadesDAO.selectByIdModalidade(dadosLeilao[0].modalidade_id)

            let dadosComitente = await comitentesDAO.selectComitenteById(dadosLeilao[0].comitente_id)

            await Promise.all(dadosLeilao.map(dadosLeilao => {
                dadosLeilao.categoria_id = dadosCategoria
                dadosLeilao.modalidade_id = dadosModalidade

                dadosLeilao.comitente_id = dadosComitente

            }))

            let lotes = await loteDAO.selectLotesByLeilao(dadosLeilao[0].id)

            for (let i = 0; i < lotes.length; i++) {
                const lote = lotes[i];

                let dadosStatus = await statusDAO.selectByIdStatus(lote.status_id)

                delete lote.status_id
                lote.status = dadosStatus
                
            }

            leilaoJSON.leilao = dadosLeilao
            leilaoJSON.lotes = lotes
            leilaoJSON.qntd_lotes = lotes.length
            leilaoJSON.status_code = 200

            return leilaoJSON

        } else {
            return message.ERROR_NOT_FOUND
        }


    } catch (error) {
        return false
    }
}

const addLeilao = async (dados, contentType) => {

    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let newLeilaoJSON = {}

            if (dados.nome == "" || dados.nome == undefined || dados.nome == null || dados.nome.length > 100 ||
                dados.data_inicio == "" || dados.data_inicio == undefined || dados.data_inicio == null || dados.data_inicio.length > 10 ||
                dados.data_final == "" || dados.data_final == undefined || dados.data_final == null || dados.data_final.length > 10 ||
                dados.retirada == "" || dados.retirada == undefined || dados.retirada == null || dados.retirada.length > 200 ||
                dados.categoria_id == "" || dados.categoria_id == undefined || dados.categoria_id == null || isNaN(dados.categoria_id) ||
                dados.comitente_id == "" || dados.comitente_id == undefined || dados.comitente_id == null || isNaN(dados.comitente_id) ||
                dados.modalidade_id == "" || dados.modalidade_id == undefined || dados.modalidade_id == null || isNaN(dados.modalidade_id) ||
                dados.foto_capa == "" || dados.foto_capa == undefined || dados.foto_capa == null || dados.foto_capa.length > 250
                ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let newLeilao = await leiloesDAO.insertNewLeilao(dados)
                let leilaoId = await leiloesDAO.selectLastId()

                let leilao = await leiloesDAO.selectByIdLeilao(leilaoId[0].id)

                let dadosCategoria = await categoriasDAO.selectCategoriaById(dados.categoria_id)

                let dadosModalidade = await modalidadesDAO.selectByIdModalidade(dados.modalidade_id)

                let dadosComitente = await comitentesDAO.selectComitenteById(dados.comitente_id)

                await Promise.all(leilao.map(leilao => {
                    leilao.categoria_id = dadosCategoria
                    leilao.modalidade_id = dadosModalidade

                    leilao.comitente_id = dadosComitente

                }))

                if (newLeilao) {
                    newLeilaoJSON.leilao = leilao
                    newLeilaoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    newLeilaoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    newLeilaoJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return newLeilaoJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }

            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const updateLeilao = async (dados, contentType, id) => {

    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let updatedLeilaoJSON = {}

            if (id == undefined || isNaN(id) || id == "") {
                return message.ERROR_INVALID_ID
            } else {

                if (dados.nome == "" || dados.nome == undefined || dados.nome == null || dados.nome.length > 100 ||
                    dados.data_inicio == "" || dados.data_inicio == undefined || dados.data_inicio == null || dados.data_inicio.length > 10 ||
                    dados.data_final == "" || dados.data_final == undefined || dados.data_final == null || dados.data_final.length > 10 ||
                    dados.retirada == "" || dados.retirada == undefined || dados.retirada == null || dados.retirada.length > 200 ||
                    dados.categoria_id == "" || dados.categoria_id == undefined || dados.categoria_id == null || isNaN(dados.categoria_id) ||
                    dados.comitente_id == "" || dados.comitente_id == undefined || dados.comitente_id == null || isNaN(dados.comitente_id) ||
                    dados.modalidade_id == "" || dados.modalidade_id == undefined || dados.modalidade_id == null || isNaN(dados.modalidade_id||
                        dados.foto_capa == "" || dados.foto_capa == undefined || dados.foto_capa == null || dados.foto_capa.length > 250)) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {

                    let updatedLeilao = await leiloesDAO.atualizarLeilao(dados, id)

                    let leilao = await leiloesDAO.selectByIdLeilao(id)

                    let dadosCategoria = await categoriasDAO.selectCategoriaById(dados.categoria_id)

                    let dadosModalidade = await modalidadesDAO.selectByIdModalidade(dados.modalidade_id)

                    let dadosComitente = await comitentesDAO.selectComitenteById(dados.comitente_id)

                    await Promise.all(leilao.map(leilao => {
                        leilao.categoria_id = dadosCategoria
                        leilao.modalidade_id = dadosModalidade

                        leilao.comitente_id = dadosComitente

                    }))

                    if (updatedLeilao) {
                        updatedLeilaoJSON.leilao = leilao
                        updatedLeilaoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        updatedLeilaoJSON.status = message.SUCCESS_CREATED_ITEM.status
                        updatedLeilaoJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return updatedLeilaoJSON
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }

                }
            }

        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const deleteLeilao = async (id) => {
    try {

        let leilaoId = id

        if (leilaoId == '' || leilaoId == undefined || isNaN(leilaoId)) {
            return message.ERROR_INVALID_ID
        } else {
            let leilao = await leiloesDAO.selectByIdLeilao(leilaoId)

            if (leilao.length > 0) {
                let deletedLeilao = await leiloesDAO.deletar(leilaoId)
                if (deletedLeilao) {
                    return message.SUCCESS_DELETED_ITEM
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            } else {
                return message.ERROR_NOT_FOUND
            }
        }

    } catch (error) {
        return false
    }
}

module.exports = {
    listLeiloes,
    addLeilao,
    updateLeilao,
    deleteLeilao,
    listLeilaoById
}