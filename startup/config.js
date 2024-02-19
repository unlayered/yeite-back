import config from "config";
import debug from 'debug'
debug("app:startup");

export default function configure () {

    const requiredVariables = ["jwtPrivateKey", "databaseUri", "splitHost"];

    requiredVariables.forEach( variable => {
        
        if (!config.get(variable)) {
            throw new Error(`FATAL ERROR: ${variable} is not defined.`);
          }
    })
  };
  