import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import _ from "lodash";
import express from "express";
import mongoose from "mongoose";
import { StemType, validate } from "../models/StemType.js";

const router = express.Router();

router.get("/type/", async (req, res) => {
  const stemTypes = await StemType.find();
  res.status(200).send({ total: stemTypes.length, items: stemTypes });
});

router.get("/type/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send('The id is invalid.')

  const stemType = await StemType.findById( req.params.id );
  if (!stemType) return res.status(404).send("The stemType was not found");
  res.send(stemType);
});

router.post("/type/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const stemType = new StemType(
    _.pick(req.body, ["name", "type"])
  )

  await stemType.save();

  res.send(stemType);
});

router.put("/type/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const stemType = await StemType.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["name", "type"]),
    { new: true }
  );

  if (!stemType) return res.status(404).send("The stemType was not found");
  res.send(stemType);
});

router.delete("/type/:id", [auth, admin], async (req, res) => {
  const stemType = await StemType.findByIdAndRemove(req.params.id);
  if (!stemType) return res.status(404).send("The stemType was not found");
  res.send(stemType);
});

export default router;
