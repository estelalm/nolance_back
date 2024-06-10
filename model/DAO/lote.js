/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 28/05/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/



const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllLotes = async function() {

    try{
        let sql = `select id, nome, data_inicio, descricao, reserva, status_id as status, leilao_id as leilao from tbl_lote`

        let rsLotes = await prisma.$queryRawUnsafe(sql)

        return rsLotes

    }catch(error){
        console.log(error)
        return false
    }
}

const selectLoteById = async function(id) {

    let idLote = id

    try{
        let sql = `select id, nome, data_inicio, descricao, reserva, status_id as status, leilao_id as leilao from tbl_lote where id = ${idLote}`

        let rsLote = await prisma.$queryRawUnsafe(sql)

        return rsLote
    }catch(error){
        return false
    }
}

const selectLotesByLeilao = async function(id) {
    let idLote = id

    try {
        let sql = `select id, nome, data_inicio, descricao, reserva, status_id, leilao_id as leilao from tbl_lote where leilao_id = ${idLote}`
        
        let rsLotes = await prisma.$queryRawUnsafe(sql)

        return rsLotes
    } catch (error) {
        return false
    }
}

const selectLoteByFiltro = async function(params) {

    try{

        let keys = Object.keys(params)
       
        let condition
        keys.forEach(async key => {
            if (condition) {
                condition += ` and ${key} like "%${params[key]}%"`
            } else {
                condition = `${key} like "%${params[key]}%"`
            }
        })
        let sql = `select id, nome, data_inicio, descricao, reserva, status_id as status, leilao_id as leilao from tbl_lote where ${condition}`

        let rsLote = await prisma.$queryRawUnsafe(sql)

        return rsLote
    }catch(error){
        return false
    }
}

const selectImagemLote = async function(id) {

    try{
        let sql = `select id, url from tbl_imagens_lote where lote_id=${id}`

        let rsLotes = await prisma.$queryRawUnsafe(sql)

        return rsLotes

    }catch(error){
        console.log(error)
        return false
    }
}

const insertLote = async function(dados) {

    let dadosLote = dados

    try{
        let sql = `insert into tbl_lote(nome, data_inicio, descricao, reserva, status_id, leilao_id) values 
                ('${dadosLote.nome}', '${dadosLote.data_inicio}', '${dadosLote.descricao}', ${dadosLote.reserva}, ${dadosLote.status}, ${dadosLote.leilao});`

        let rsLote = await prisma.$executeRawUnsafe(sql)

        return rsLote
    }catch(error){
        console.log(error)
        return false
    }
}

const insertCategoriaLote = async function(subcategoriaId, loteId) {

    let subcategoria = subcategoriaId
    let lote = loteId

    try{
        let sql = `insert into tbl_categoria_lote(subcategoria_id, lote_id) values 
                (${subcategoria}, ${lote});`

        let rsLote = await prisma.$executeRawUnsafe(sql)

        return rsLote
    }catch(error){
        console.log(error)
        return false
    }
}


const insertImageLote = async function(url, idLote){
    let id = idLote

    try{
        let sql = `insert into tbl_imagens_lote (url, lote_id) values
        ("${url}",${id})`
        console.log(sql)
        
        let rsLote = await prisma.$executeRawUnsafe(sql)

        return rsLote
    }catch(error){
        console.log(error)
        return false
    }
}

const updateLote = async function(dadosLote, idLote) {

    let dados = dadosLote
    let id = idLote

    try{
        let sql = `update tbl_lote set
                  nome =  '${dados.nome}',
                  data_inicio = '${dadosLote.data_inicio}', 
                  descricao = '${dadosLote.descricao}', 
                  reserva = ${dadosLote.reserva}, 
                  status_id = ${dadosLote.status},
                  leilao_id =${dadosLote.leilao}
                  where id = ${id}`

        let rsLote = await prisma.$executeRawUnsafe(sql)

        return rsLote
    }catch(error){
        console.log(error)
        return false
    }
}

const updateCategoriaLote = async function(subcategoriaId, subcategoriaAntigaId, loteId) {

    let subcategoriaNova = subcategoriaId
    let subcategoriaAntiga = subcategoriaAntigaId
    let lote = loteId

    try{
        let sql = `update tbl_categoria_lote set 
        subcategoria_id = ${subcategoriaNova}
        where lote_id = ${lote} and subcategoria_id=${subcategoriaAntiga};`

        let rsLote = await prisma.$executeRawUnsafe(sql)

        return rsLote
    }catch(error){
        console.log(error)
        return false
    }
}

const deleteLote = async function(idLote) {

    let id = idLote

    try{
        let sql = `delete from tbl_lote where id = ${id}`
        
        let rsLote = await prisma.$executeRawUnsafe(sql)

        return rsLote
    }catch(error){
        console.log(error)
        return false
    }
}


// const deleteCategoriaLote = async function(idLote) {

//     let id = idLote

//     try{
//         let sql = `delete from tbl_categoria_lote where lote_id = ${id}`
        
//         let rsLote = await prisma.$executeRawUnsafe(sql)

//         return rsLote
//     }catch(error){
//         console.log(error)
//         return false
//     }
// }

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_lote limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idLote => {
        id = Number(idLote.id)
    })


    if(id){
        return id
    }else{
        return false
    }
    }catch(error){
        console.log(error)
        return false
    }

}


module.exports = {
    selectAllLotes,
    selectLoteById,
    selectLoteByFiltro,
    selectImagemLote,
    insertLote,
    insertCategoriaLote,
    insertImageLote,
    updateLote,
    updateCategoriaLote,
    deleteLote,
    selectLastInsertId,
    selectLotesByLeilao
}
