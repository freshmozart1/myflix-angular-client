/**
 * @constant
 * @type {Object}
 * @ignore
 * The environment configuration
 */
export const environment = {
    /**
     * The URL of the API
     * @ignore
     */
    apiUrl: process.env['API_URL'],
    /**
     * The name of the AWS S3 bucket
     * @ignore
     */
    S3_BUCKET: process.env['S3_BUCKET'],
    /**
     * The region of the AWS S3 bucket
     * @ignore
     */
    S3_REGION: process.env['S3_REGION'],
    /**
     * The access key ID for the AWS S3 bucket
     * @ignore
     */
    AWS_ID: process.env['AWS_ID'],
    /**
     * The secret access key for the AWS S3 bucket
     * @ignore
     */
    AWS_SECRET: process.env['AWS_SECRET']
};