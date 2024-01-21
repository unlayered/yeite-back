import config from "config";
import debug from 'debug'
debug("app:startup");

export default function configure () {
    if (!config.get("jwtPrivateKey")) {
      throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
    }
    if (!config.get("database-uri")  ) {
      throw new Error("FATAL ERROR: database-uri is not defined.");
    }
    if (!config.get("inputPath")) {
      throw new Error("FATAL ERROR: inputPath is not defined.");
    }
    if (!config.get("outputPath")) {
      throw new Error("FATAL ERROR: outputPath is not defined.");
    }
  };
  