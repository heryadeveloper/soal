const Joi = require('@hapi/joi');

const inputMapel = {
    body: Joi.object().keys({
        idmapel: Joi.number(),
        nama_mapel: Joi.string(),
        kelas: Joi.string(),
    })
}

const inputSoal = {
    body: Joi.object().keys({
        nama_mapel: Joi.string().required(),
        id_mapel: Joi.number().required(),
        kelas: Joi.string().required(),
        kode_soal: Joi.number().required(),
        nomor_soal: Joi.number().required(),
        jenis_soal: Joi.number().valid(0, 1).required(), // 0 untuk pilihan ganda, 1 untuk essay
        text_soal: Joi.string().required(),
        available_on: Joi.date(),
        text_jawaban: Joi.object().keys({
            pilihan_ganda: Joi.array().items(
                Joi.object().keys({
                    idx_pilihan: Joi.string().required(),  // "a", "b", "c", dll.
                    pilihan: Joi.string().required(),      // Text dari jawaban pilihan
                    pilihan_benar: Joi.number().valid(0, 1).required(), // 1 jika benar, 0 jika salah
                    skor: Joi.number().required()          // Skor untuk jawaban yang benar
                })
            ),
            essay: Joi.object().keys({
                jawaban: Joi.string().allow(null, '').optional() // Jawaban essay bisa null atau string
            }).optional()
        }).required()
    })
}

const inputJawabanSiswa = {
    body: Joi.object().keys({
        payload: Joi.array().items(
            Joi.object().keys({
                nama_siswa: Joi.string().required(),
                nisn: Joi.string().required(),
                kelas: Joi.string().required(),
                idmapel: Joi.number().required(),
                kode_soal: Joi.number().required(),
                nomor_soal: Joi.number().required(),
                jenis_soal: Joi.number().required(),
                text_soal: Joi.string(),
                jawaban: Joi.object().keys({
                    idx_pilihan: Joi.string().when('jenis_soal', { is: 0, then: Joi.required() }), // Required for multiple choice
                    text_jawaban: Joi.string().when('jenis_soal', { is: 1, then: Joi.required() }) // Required for essay
                }).required(), // Ensure jawaban is required as well
                skor: Joi.number(),
            }).required()
        ).required()
    }).required()
}

module.exports = {
    inputMapel,
    inputSoal,
    inputJawabanSiswa
}