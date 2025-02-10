module.exports = (sequelize, DataType) => {
    const benarsalah = sequelize.define(
        'benarsalah',
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
            textsoal: {
                type:DataType.STRING,
                allowNull: false,
            },
            jawaban:{
                type:DataType.INTEGER,
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
            }
        },{
            tableName:'benarsalah'
        }
    );
    return benarsalah;

}