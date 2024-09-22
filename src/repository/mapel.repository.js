const db = require('../db/models');

async function insertDataMapel(idmapel, nama_mapel, kelas){
    try {
        await db.mapel.create({
            idmapel,
            nama_mapel,
            kelas,
            created_date: new Date,
        });
    } catch (error) {
        console.error('Error when inserting data mapel');
        throw error;
    }
}

async function getDataMapel(){
    try {
        const responseData = await db.mapel.findAll({
            raw:true,
        });
        return responseData;
    } catch (error) {
        console.error('Error when get data mapel');
        throw error;
    }
}

async function getDataMapelForOne(idmapel){
    try {
        const responseData = await db.mapel.findOne({
            where: {
                idmapel
            },
            raw: true
        })
        return responseData;
    } catch (error) {
        console.error('Error get one mapel');
        throw error;
    }
}

module.exports = {
    insertDataMapel,
    getDataMapel,
    getDataMapelForOne
}