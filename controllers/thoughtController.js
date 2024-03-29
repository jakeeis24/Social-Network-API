const User = require("../models/User");
const Thought = require("../models/Thought");

module.exports = {
  // GET all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  },

  //GET a single thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId }).then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ messages: "No thought associated with this id." })
        : res.json(thought)
    );
  },
  // POST create a new thought and link id to user
  createThought: async (req, res) => {
    await Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          {
            username: req.body.username,
          },
          { $push: { thoughts: thought._id } }
        );
      })
      .then((user) => {
        !user
          ? res.status(404).json({
              message: "No username assoicated with the given username!",
            })
          : res.json("Thought created");
      });
  },
  //PUT update a thought

  updateThought: async (req, res) => {
    const updatedTht = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { thoughtText: req.body.thoughtText },
      {
        runValidators: true,
        new: true,
      }
    );
    if (updatedTht) {
      res.status(200).json(updatedTht);
    } else {
      res.status(500).json("Error, check logs");
    }
  },
  //DELETE remove a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.status(200).json({ message: "thought deleted!!!!!!" })
      )
      .catch((err) => res.status(500).json(err));
  },
  //POST create a reaction stored in arr in thought
  createReaction(req, res) {
    Thought.updateOne(
      {
        _id: req.params.thoughtId,
      },
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  //DELETE remove reaction by id
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {
        $pull: { reactions: { _id: req.params.reactionId } },
      },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: "No reaction with that id!" })
          : res.status(200).json({ message: `Reaction has been deleted.` })
      )
      .catch((err) => res.status(500).json(err));
  },
};
