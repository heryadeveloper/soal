const { mapelRepository } = require("../repository");
const catchAsync = require("../utils/catchAsync");
const errorNotFound = require('../utils/errorExpectationFailed');
const responseInfo = require("../utils/responseInfo");
const upload = require('../middleware/multerConfig');
const expectationFailed = require("../utils/errorExpectationFailed");

const uploadFile = catchAsync(async(req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send(errorNotFound('File upload failed', err));
        }

        if (!req.file) {
            return res.status(400).send(errorNotFound('No File Upload', null));
        }

        const {nama} = req.body;

        console.log('upload file: ', nama);

        const fileName = req.file.filename;
        const filepath = `/upload/${fileName}`;

        try {
            console.log('nama path: ', filepath);
            const result = await mapelRepository.uploadGamber(nama, fileName, filepath)
            res.send(responseInfo('File upload successfull', result));
        } catch (error) {
            res.status(417).send(errorNotFound('SOmething wrong', error));
        }
    });
});

const getImage = catchAsync(async(req, res) => {
    const {nama} = req.query;
    try {
        console.log('get image');
        const imageData = await mapelRepository.getImage(nama);
        res.send(responseInfo('Found path image guru', imageData));
    } catch (error) {
        res.send(expectationFailed('Something error', null));
    }
})

module.exports = {
    uploadFile,
    getImage
}