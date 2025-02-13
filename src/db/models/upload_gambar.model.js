module.exports = (sequelize, DataType) => {
    const uploadGambar = sequelize.define(
        'upload_gambar',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nama:{
                type:DataType.STRING,
                allowNull: false,
            },
            nama_file:{
                type:DataType.STRING,
                allowNull: false,
            },
            path: {
                type:DataType.STRING,
                allowNull: false,
            },
            created_at:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            }
        },{
            tableName:'upload_gambar'
        }
    );
    return uploadGambar
    ;
}