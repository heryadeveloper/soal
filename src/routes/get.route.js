const express = require('express');
const validate = require('../middleware/validate');
const { mapelController, soalController, uploadController } = require('../controller');
const { mapelValidation } = require('../validation');

const router = express.Router();

const routes = [
    { path: '/addMapelBaru', method: 'post', validation: mapelValidation.inputMapel,  handler: mapelController.inputMapel},
    { path: '/getDataMapel', method: 'get', handler: mapelController.getDataMapel},
    { path: '/getSoal', method:'get', handler: soalController.getSoal},
    { path: '/getSoalEssay', method:'get', handler: soalController.getSoalEssay},
    { path: '/getPilgan', method: 'get', handler: soalController.getPilgan},
    { path: '/getEssay', method: 'get', handler: soalController.getEssay},
    { path: '/insertSoal', method: 'post', validation: mapelValidation.inputSoal, handler: soalController.inputSoal},
    { path: '/insertJawabanSiswa', method: 'post', validation: mapelValidation.inputJawabanSiswa, handler: soalController.inputJawabanSiswa},
    { path: '/getAvailableTest', method: 'get', handler: soalController.getAvailableTest},
    { path: '/deleteSoal', method : 'post', validation: mapelValidation.deleteSoal, handler: soalController.deleteSoal},
    { path: '/getJawabanSiswa', method: 'get', handler: soalController.getDataJawabanSiswa},
    { path: '/getMapelForGuru', method: 'get', handler: mapelController.getMapelForGuru},
    { path: '/updateSkorSiswa', method: 'post', validation: mapelValidation.updateSkorJawabanSiswa, handler: soalController.updateSkorJawabanSiswa},
    { path: '/sumSkorSiswa', method: 'get', handler: soalController.sumSkorJawabanSiswa},
    { path: '/analisisJawaban', method: 'get', handler: soalController.analisisJawaban},
    { path: '/insertAnalisisJawabanSiswa', method: 'post', validation: mapelValidation.analisisJawabanSiswa, handler: soalController.insertAnalisisJawabanSiswa},
    { path: '/deleteMapel', method: 'post', validation: mapelValidation.deleteMapel, handler: mapelController.deleteMapel},
    { path: '/getMapelForGuruUseCode', method: 'get', handler: mapelController.getMapelForGuruUseKodeGuru},
    { path: '/insertSoalMencocokan', method: 'post', handler: soalController.insertSoalMencocokan, validation: mapelValidation.inputSoalMencocokan},
    { path: '/getPreviewSoal', method: 'get', handler: soalController.getSoalPreview},
    { path: '/getStatusPengerjaan', method: 'get', handler: soalController.getStatusPengerjaan},
    { path: '/insertJawabanSiswaMencocokan', method: 'post', validation: mapelValidation.inputJawabanSiswaMencocokan, handler: soalController.inputJawabanSiswaMencocokan}
];

routes.forEach(route => {
    const { path, method, validation, handler } = route;
    let middleware = null;
    if (validation) {
        middleware = validate(validation);
    }

    if (middleware) {
        router.route(path)[method](middleware, handler);
    }else{
        router.route(path)[method](handler);
    }
})

module.exports = router;