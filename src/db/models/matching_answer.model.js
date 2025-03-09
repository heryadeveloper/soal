module.exports = (sequelize, DataType) => {
    const matchingAnswer = sequelize.define(
        'matching_answer',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nomor:{
                type:DataType.INTEGER,
                allowNull: false
            },
            jenis_soal:{
                type:DataType.INTEGER,
                allowNull: false
            },
            jawaban:{
                type:DataType.STRING,
                allowNull: false
            },
            
            kelas:{
                type:DataType.STRING,
                allowNull: false
            },
            skor:{
                type:DataType.INTEGER,
                allowNull: false
            },
            created_at:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            },
            id_jawaban_benar:{
                type:DataType.INTEGER,
                allowNull: false
            },
            kode_mapel:{
                type:DataType.INTEGER,
                allowNull: false
            },
        },{
            tableName:'matching_answer'
        }
    );
    return matchingAnswer;

}