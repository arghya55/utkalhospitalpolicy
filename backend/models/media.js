const mongoose =
  require("mongoose");

const mediaSchema =
  new mongoose.Schema(
    {
      // TITLE

      title: {
        type: String,
      },

      // DESCRIPTION

      description: {
        type: String,
        default: "",
      },

      // CATEGORY

      category: {
        type: String,
      },

      // DEPARTMENT

      department: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Department",
      },

      // USER

    uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

      // FILE URL

      url: {
        type: String,
      },

      // FILE NAME

      public_id: {
        type: String,
      },

      // FILE TYPE

      type: {
        type: String,
      },

      // ACTIVE / INACTIVE

     status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active",
},

      // LIKE SYSTEM

      likes: {
        type: Number,

        default: 0,
      },

      // COMMENTS

      comments: [
        {
          user: String,

          text: String,

          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Media",
    mediaSchema
  );