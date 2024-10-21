import { Pipe, PipeTransform } from '@angular/core';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { environment } from '../environments/environment';
/**
 * This pipe is responsible for transforming image paths into AWS S3 URLs for thumbnails and posters.
 * @hideconstructor
 */
@Pipe({
  name: 'awsImages',
  standalone: true
})
export class AwsImagesPipe implements PipeTransform {

  /**
   * 
   * @param imagePath The path of the image in the S3 bucket.
   * @param imageType The type of the image
   * @returns {Promise<string>} A promise that resolves to the URL of the image.
   */
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
