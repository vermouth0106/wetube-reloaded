import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: String,
    rating: Number,
  },
});

const video = mongoose.model("Video", videoSchema);

export default video;
