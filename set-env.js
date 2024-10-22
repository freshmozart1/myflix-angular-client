import { writeFile } from "fs";

const targetPath = "./src/environments/environment.ts";

const envConfigFile = `export const environment = {
    apiUrl: '${process.env['API_URL']}',
    S3_BUCKET: '${process.env['S3_BUCKET']}',
    S3_REGION: '${process.env['S3_REGION']}',
    AWS_ID: '${process.env['AWS_ID']}',
    AWS_SECRET: '${process.env['AWS_SECRET']}'
};`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    }

    console.log(`Output generated at ${targetPath}`);
});