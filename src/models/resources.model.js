import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Resources = sequelize.define(
    "resource",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      resource_type: {
        type: DataTypes.ENUM("image", "pdf", "video"),
        allowNull: false,
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resource_class: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      uploaded_by: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin",
      },
      resource_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return Resources;
};

