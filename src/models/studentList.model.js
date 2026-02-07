// // import { DataTypes } from "sequelize";

// // export default (sequelize) => {
// //   const StudentList = sequelize.define(
// //     "student_List",
// //     {
// //       id: {
// //         type: DataTypes.INTEGER,
// //         autoIncrement: true,
// //         primaryKey: true,
// //       },

// //       school_id: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //         references: {
// //           model: "schools",
// //           key: "school_id",
// //         },
// //       },
// //       school_name: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       name: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       student_class: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       email: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       address: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       city: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       state: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       pincode: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       mobile_number: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       syllabus: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //       password: {
// //         type: DataTypes.STRING,
// //         allowNull: false,
// //       },
// //     },
// //     {
// //       timestamps: true,
// //     }
// //   );

// //   return StudentList;
// // };

// // StudentList.beforeCreate(async (student) => {
// //   if (student.password) {
// //     student.password = await bcrypt.hash(student.password, 10);
// //   }
// // });

// // StudentList.beforeUpdate(async (student) => {
// //   if (student.changed("password")) {
// //     student.password = await bcrypt.hash(student.password, 10);
// //   }
// // });

// // StudentList.prototype.isPasswordCorrect = async function (password) {
// //   return await bcrypt.compare(password, this.password);
// // };



// import { DataTypes } from "sequelize";
// import bcrypt from "bcrypt"; // Make sure to import bcrypt if not already

// export default (sequelize) => {
//   const StudentList = sequelize.define(
//     "student_List",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       school_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "schools",
//           key: "school_id",
//         },
//       },
//       school_name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       student_class: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       address: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       city: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       state: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       pincode: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       mobile_number: {
//         type: DataTypes.BIGINT,
//         allowNull: false,
//       },
//       syllabus: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

//   StudentList.beforeCreate(async (student) => {
//     if (student.password) {
//       student.password = await bcrypt.hash(student.password, 10);
//     }
//   });

//   StudentList.beforeUpdate(async (student) => {
//     if (student.changed("password")) {
//       student.password = await bcrypt.hash(student.password, 10);
//     }
//   });

//   StudentList.prototype.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password);
//   };

  

//   return StudentList;
// };

import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

export default (sequelize) => {
  const StudentList = sequelize.define(
    "student_List",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      school_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "schools",
          key: "school_id",
        },
      },
      school_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      student_class: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
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
      pincode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      syllabus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING, // Make sure to store password securely (bcrypt hashed)
        allowNull: false,
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: async (student) => {
          if (student.password) {
            const hashedPassword = await bcrypt.hash(student.password, 10);
            student.password = hashedPassword;
          }
        },
        beforeUpdate: async (student) => {
          if (student.changed("password")) {
            const hashedPassword = await bcrypt.hash(student.password, 10);
            student.password = hashedPassword;
          }
        },
      },
    }
  );

  StudentList.prototype.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return StudentList;
};
