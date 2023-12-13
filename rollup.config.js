import { defineConfig } from "rollup";
import ts from "rollup-plugin-ts";

export default defineConfig({
  input: "src/index.ts",
  output: {
    format: "commonjs",
    file: "lib/index.js",
  },
  external: [
    "node:path",
    "node:fs",
    "uuid",
    "express",
    "morgan",
    "cors",
    "axios",
    "express-jwt",
    "nodemailer",
    "hogan.js",
    "jsonwebtoken",
    "sequelize",
    "bcrypt",
  ],
  plugins: [
    ts({
      tsconfig: "tsconfig.json",
    }),
  ],
});
