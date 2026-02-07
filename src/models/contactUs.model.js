import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Contact = sequelize.define(
    "contactUs",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
       
      },
      mobile_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Options object for the model
      timestamps: true,
    }
  );

  return Contact;
};
