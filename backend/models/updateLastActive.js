import { updateOne } from "../models/User";
import { updateOne as _updateOne } from "../models/Handyman";

const updateLastActive = async (req, res, next) => {
  try {
    if (req.user) {
      await updateOne({ _id: req.user.id }, { lastActive: new Date() });
    }
    if (req.handyman) {
      await _updateOne({ _id: req.handyman.id }, { lastActive: new Date() });
    }
  } catch (error) {
    console.error("Error updating last active:", error);
  }
  next(); // Continue to the next middleware or route handler
};

export default updateLastActive;
