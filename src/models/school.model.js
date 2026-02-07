import { DataTypes } from "sequelize";

export default (sequelize) => {
  const School = sequelize.define(
    "school",
    {
      school_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      school_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pincode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      STD_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      landline: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mobile_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      principal_name_prefix: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      principal_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      syllabus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

  return School;
};
