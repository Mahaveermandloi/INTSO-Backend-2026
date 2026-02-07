import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Testimonial = sequelize.define(
    "testimonial",
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
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Testimonial;
};
