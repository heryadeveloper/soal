module.exports = (sequelize, DataType) => {
    const matchingQuestion = sequelize.define(
        'matching_question',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            kode_mapel:{
                type:DataType.INTEGER,
                allowNull: false
            },
            nomor_soal:{
                type:DataType.INTEGER,
                allowNull: false
            },
            jenis_soal:{
                type:DataType.INTEGER,
                allowNull: false
            },
            text_soal: {
                type:DataType.STRING,
                allowNull: false,
            },
            id_jawaban_benar:{
                type:DataType.INTEGER,
                allowNull: false
            },
            kelas:{
                type:DataType.STRING,
                allowNull: false
            },
            created_at:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            },
        },{
            tableName:'matching_question'
        }
    );
    return matchingQuestion;

}