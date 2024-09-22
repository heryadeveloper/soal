const { mapelRepository } = require("../repository");

async function insertDataMapel(req){
    const {idmapel, nama_mapel, kelas} = req.body;
    try {
        await mapelRepository.insertDataMapel(idmapel, nama_mapel, kelas);
        return {nama_mapel, kelas};
    } catch (error) {
        console.error('Error in service mapel');
        throw error;
    }
}

async function getDataMapel(){
    try {
        const responseData = await mapelRepository.getDataMapel();
        return responseData;
    } catch (error) {
        console.error('Error in service mapel');
        throw error;
    }
}

module.exports = {
    insertDataMapel,
    getDataMapel
}