module.exports = (sequelize, DataType) => {
    const soal = sequelize.define(
        'soal',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nomor_soal:{
                type: DataType.INTEGER,
                allowNull: false,
            },
            kode_mapel:{
                type: DataType.INTEGER,
                allowNull: false,
            },
            jenis_soal:{
                type: DataType.INTEGER,
                allowNull: false,
            },
            kelas: {
                type: DataType.STRING,
                allowNull: false,
            },
            text_soal: {
                type: DataType.STRING,
                allowNull: false,
            },
            created_at:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            },
            available_on:{
                type:DataType.DATE,
                allowNull: true,
            },
            status:{
                type:DataType.INTEGER,
                allowNull: true
            },
            skor:{
                type:DataType.INTEGER,
                allowNull: true,
            },
            path_image: {
                type: DataType.STRING,
                allowNull: true,
            },
        },{
            tableName:'soal'
        }
    );

    return soal;
}