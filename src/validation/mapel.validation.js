const Joi = require('@hapi/joi');

const inputMapel = {
    body: Joi.object().keys({
        idmapel: Joi.number(),
        nama_mapel: Joi.string(),
        kelas: Joi.string(),
        guru_pengampu: Joi.string(),
        kode_guru: Joi.string(),
    })
}

const inputSoal = {
    body: Joi.object().keys({
        nama_mapel: Joi.string().required(),
        id_mapel: Joi.number().required(),
        kelas: Joi.string().required(),
        // kode_soal: Joi.number().required(),
        nomor_soal: Joi.number().required(),
        jenis_soal: Joi.number().valid(0, 1).required(), // 0 untuk pilihan ganda, 1 untuk essay
        text_soal: Joi.string().required(),
        available_on: Joi.date(),
        skor: Joi.number(),
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
                nomor_soal: Joi.number().required(),
                jenis_soal: Joi.number().required(),
                text_soal: Joi.string(),
                jawaban: Joi.object()
                    .keys({
                        idx_pilihan: Joi.string().optional().when('..jenis_soal', { is: 0, then: Joi.required() }),
                        text_jawaban: Joi.string().optional().when('..jenis_soal', { is: 1, then: Joi.required() })
                    })
                    .or('idx_pilihan', 'text_jawaban') // Require at least one of the fields in jawaban
                    .required(),// Ensure jawaban is required as well
                skor: Joi.number(),
            }).required()
        ).required()
    }).required()
}

const deleteSoal = {
    body: Joi.object().keys({
        nomor_soal: Joi.number().required(),
        kode_mapel: Joi.number().required(), 
        jenis_soal: Joi.number().required(), 
        kelas: Joi.string().required(),
    })
}

const updateSkorJawabanSiswa = {
    body: Joi.object({
        payload: Joi.array().items(
            Joi.object({
                skor: Joi.number().required(),
                kelas: Joi.string().required(),
                nisn: Joi.string().required(),
                idmapel: Joi.number().required(),
                nomor_soal: Joi.number().required()
            })
        ).required()
    })
}

const analisisJawabanSiswa = {
    body: Joi.object({
        kelas: Joi.string().required(),
        idmapel: Joi.number().required(),
    })
}

module.exports = {
    inputMapel,
    inputSoal,
    inputJawabanSiswa,
    deleteSoal,
    updateSkorJawabanSiswa,
    analisisJawabanSiswa
}