module.exports = (sequelize, DataType) => {
    const comparation = sequelize.define(
        'comparation',
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
            pernyataan: {
                type:DataType.STRING,
                allowNull: false,
            },
            jawaban:{
                type:DataType.STRING,
                allowNull: false
            },
            created_at:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
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
            idx:{
                type:DataType.INTEGER,
                allowNull: false
            },
        },{
            tableName:'comparation'
        }
    );
    return comparation;

}