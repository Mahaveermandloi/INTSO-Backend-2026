import { DataTypes } from "sequelize";

export default (sequelize) => {
  const NewsAndUpdates = sequelize.define(
    "news_update",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      posted_By: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      post_Type: {
        type: DataTypes.ENUM("news", "event", "exam", "update"),
        allowNull: false,
      },
      event_Date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        default: "",
      },
      event_Time: {
        type: DataTypes.TIME,
        allowNull: true,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

  return NewsAndUpdates;
};
