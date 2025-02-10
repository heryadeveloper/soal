const { mapelService } = require('../service');
const catchAcync = require('../utils/catchAsync');
const expectationFailed = require('../utils/errorExpectationFailed');
const responseInfo = require('../utils/responseInfo');

const inputMapel = catchAcync(async(req, res) => {
    const inputMapel = await mapelService.insertDataMapel(req);
    if (inputMapel) {
        res.send(responseInfo('Success insert mapel baru', inputMapel));
    } else {
        res.send(expectationFailed('Something error', null));
    }
})

const getDataMapel = catchAcync(async(req, res) => {
    const getDataMapel = await mapelService.getDataMapel();
    if (getDataMapel) {
        res.send(responseInfo('Success Get Data Mapel', getDataMapel));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})

const getMapelForGuru = catchAcync(async(req, res) => {
    const getMapelForGuru = await mapelService.getMapelForGuru(req);
    if (getMapelForGuru) {
        res.send(responseInfo('Success Get Data Mapel', getMapelForGuru));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})

const deleteMapel = catchAcync(async(req, res) => {
    const deleteMapels = await mapelService.deleteMapel(req);
    if (deleteMapels) {
        res.send(responseInfo('Success Delete Mapel', deleteMapels));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})

const getMapelForGuruUseKodeGuru = catchAcync(async(req, res) => {
    const getMapelForGuru = await mapelService.getMapelForGuruUseKodeGuru(req);
    if (getMapelForGuru) {
        res.send(responseInfo('Success Get Data Mapel', getMapelForGuru));
    } else {
        res.send(expectationFailed('Something Error', null));
    }
})

module.exports = {
    inputMapel,
    getDataMapel,
    getMapelForGuru,
    deleteMapel,
    getMapelForGuruUseKodeGuru
}