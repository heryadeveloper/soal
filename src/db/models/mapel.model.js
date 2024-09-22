module.exports = (sequelize, DataType)=> {
    const mapel = sequelize.define(
        'mapel',
        {
            id:{
                type:DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            idmapel:{
                type:DataType.INTEGER,
                allowNull:false,
            },
            nama_mapel:{
                type:DataType.STRING,
                allowNull: false,
            },
            kelas:{
                type:DataType.STRING,
                allowNull:false,
            },
            created_at:{
                type:DataType.DATE,
                defaultValue: DataType.NOW,
                allowNull: false
            }
        },{
            tableName:'mapel'
        }
    );

    return mapel;
}
