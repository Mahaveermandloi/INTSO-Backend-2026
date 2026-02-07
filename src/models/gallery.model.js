import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Gallery = sequelize.define(
    "gallery",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      gallery_img: {
        type: DataTypes.STRING,
        allowNull: false,
        
      },
      caption: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return Gallery;
};
