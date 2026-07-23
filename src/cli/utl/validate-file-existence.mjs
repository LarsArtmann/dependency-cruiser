import { accessSync, constants as fsConstants } from "node:fs";

export default function validateFileExistence(pDirectoryOrFile) {
  try {
    accessSync(pDirectoryOrFile, fsConstants.R_OK);
  } catch (pError) {
    throw new Error(
      `Can't open '${pDirectoryOrFile}' for reading. Does it exist?\n`
    );
  }
}
