const CREDENTIAL_PATH = "./.credentials.json";

const environmentVariables = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_DEFAULT_REGION",
];
const environmentValues = environmentVariables
  .map((variable) => Deno.env.get(variable));

// At least 1 environment variable has not been set
if (environmentValues.includes(undefined)) {
  console.info("AWS Credentials could not be found in environment variables");
  try {
    const textFile = await Deno.readTextFile(CREDENTIAL_PATH);
    const json = JSON.parse(textFile);
    for (const [key, val] of Object.entries(json)) {
      if (typeof (val) == "string") {
        Deno.env.set(key, val);
      }
    }
  } catch (e) {
    console.error("Could not apply local credential override");
    throw e;
  }
}

// We know these are now populated
export const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID")!;
export const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY")!;
export const region = Deno.env.get("AWS_DEFAULT_REGION")!;
