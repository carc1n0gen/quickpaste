import { makeId } from "./ids";
import { getCollection } from "./mongodb";
import * as snippets from "./_builtin-snippets";

export async function savePaste(updates) {
  const pastes = await getCollection("pastes");
  const defaults = {
    _id: makeId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const merged = {
    ...defaults,
    ...updates,
  };

  // We are performing an upsert, so a new record is created if an existing
  // one is not found.  This let's us call this function for saving new
  // records, or updating exiting ones.
  return await pastes.updateOne(
    { _id: merged._id },
    { $set: merged },
    { upsert: true }
  );
}

export async function getPaste(id) {
  if (snippets[id]) {
    return {
      text: snippets[id],
    };
  }

  const pastes = await getCollection("pastes");
  const result = await pastes.findOne({ _id: id });

  if (!result) {
    return null;
  }

  return result;
}
