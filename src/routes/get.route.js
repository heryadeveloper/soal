const express = require('express');
const validate = require('../middleware/validate');
const { mapelController, soalController } = require('../controller');
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
    { path: '/getAvailableTest', method: 'get', handler: soalController.getAvailableTest}
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