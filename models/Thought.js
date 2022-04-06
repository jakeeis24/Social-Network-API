const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const moment = require("moment");
//need date formatting

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      //CHECK THIS DATE FORMAT
      get: (createdAt) => moment(createdAt).format("MMMM Do YYYY"),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thoughts = model("thoughts", thoughtSchema);

module.exports = Thoughts;
