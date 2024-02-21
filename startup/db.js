import config from "config";
import mongoose from "mongoose";
import winston from "winston";
import { User } from '../models/User.js'

import bcrypt from 'bcrypt';

export default function () {
  mongoose
    .set("strictQuery", false)
    .connect(config.get("databaseUri"))
    .then((res) => {
      winston.info("Connected to MongoDB");
      createRootUser();
    })
    .catch((err) => {
      console.log("Could not connect to db");
      console.error(err);
    });

};

async function createRootUser(){
  const rootUser =  await User.findOne({ isAdmin : true })
  
  if (rootUser) return;

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('admin', salt);

  const newRootUser = new User({
    "name": "Admin",
    "email": "admin@gmail.com",
    "isAdmin": true,
    "password": password,
  })

  newRootUser.save();
}   
