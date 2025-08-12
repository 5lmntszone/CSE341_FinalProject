import fs from "fs";
import { specs } from "./swagger/swagger.js";

fs.writeFileSync("./swagger.json", JSON.stringify(specs, null, 2), "utf-8");

console.log("Swagger.json generated");
