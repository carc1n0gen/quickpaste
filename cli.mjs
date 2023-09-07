#!/usr/bin/env node

import readline from "readline";
import { Command } from "commander";
import { confirm } from "@inquirer/prompts";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME || "quickpaste";
const options = {};
const program = new Command();

const client = new MongoClient(uri, options);

program.description("Command line interface to the Quickpaste database.");

program
  .command("init-db")
  .description("Initialize or update database settings.")
  .action(async () => {
    await client.connect();
    const pastes = client.db(databaseName).collection("pastes");
    try {
      await pastes.dropIndex("pasteTtl");
    } catch (e) {
      console.info("There was no pasteTtl index to drop, ignoring...");
    }
    await pastes.createIndex(
      { deleteAfter: 1 },
      { expireAfterSeconds: 0, name: "pasteTtl" }
    );
    console.info("Database successfully initialized.");
    await client.close();
  });

program
  .command("!clear-everything")
  .description("WARNING: this command clears all records from the database.")
  .action(async () => {
    const answer = await confirm({
      message:
        "WARNING: this command clears all records from the database. proceed?",
    });

    if (answer) {
      await client.connect();
      const { deletedCount } = await client
        .db(databaseName)
        .collection("pastes")
        .deleteMany({});
      console.log(`Deleted ${deletedCount} record(s)`);
      await client.close();
    } else {
      console.log("Aborting.");
    }
  });

program
  .command("export-db")
  .description("Dump the database as json lines to stdout.")
  .action(async () => {
    await client.connect();
    const cursor = client.db(databaseName).collection("pastes").find();
    for await (const item of cursor) {
      console.log(JSON.stringify(item));
    }
    await client.close();
  });

program
  .command("import-db")
  .description("Import json lines from stdin to the database.")
  .action(async () => {
    await client.connect();

    console.log("Importing...");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    for await (const line of rl) {
      const data = JSON.parse(line);
      await client
        .db(databaseName)
        .collection("pastes")
        .insertOne({
          _id: data._id,
          text: data.text,
          createdAt: new Date(data.createdAt),
          deleteAfter: new Date(data.deleteAfter),
        });
    }

    await client.close();
    console.log("Done.");
  });

program.parse();
