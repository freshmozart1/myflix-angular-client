/**
 * @class AwsImagesPipe
 * @implements {PipeTransform}
 * 
 * @requires module:@angular/core
 * @requires module:@aws-sdk/client-s3
 * @requires module:../environments/environment
 * 
 * @export AwsImagesPipe
 * 
 * @description This pipe is responsible for transforming image paths into AWS S3 URLs for thumbnails and posters.
 * 
 * @method transform
 * @description Transforms an image path into an AWS S3 URL. If the image path is not provided, it uses a placeholder image based on the image type.
 * @param {string} imagePath - The path of the image in the S3 bucket.
 * @param {'thumbnail' | 'poster'} imageType - The type of the image, either 'thumbnail' or 'poster'.
 * @returns {Promise<string>} A promise that resolves to the URL of the image.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { environment } from '../environments/environment';

@Pipe({
  name: 'awsImages',
  standalone: true
})
export class AwsImagesPipe implements PipeTransform {

  async transform(imagePath: string, imageType: 'thumbnail' | 'poster'): Promise<string> {
    try {
      const s3 = new S3Client({
        region: environment.S3_REGION,
        credentials: {
          accessKeyId: environment.AWS_ID,
          secretAccessKey: environment.AWS_SECRET
        }
      });
      const imageResponse = await s3.send(new GetObjectCommand({
        Bucket: environment.S3_BUCKET,
        Key: imagePath ? imagePath : (imageType === 'poster' ? 'placeholders/movie_set.png' : 'placeholders/movie_set_cropped.png')
      }));
      const imageReader = await imageResponse.Body?.transformToWebStream().getReader();
      let imageChunks: Uint8Array[] = [];
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await imageReader?.read()!;
        if (value) {
          imageChunks.push(value);
        }
        done = streamDone;
      }
      s3.destroy();
      return URL.createObjectURL(new Blob(imageChunks));
    } catch (error) {
      console.error(error);
      return '';
    }
  }

}
