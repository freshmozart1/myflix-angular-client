import { Pipe, PipeTransform } from "@angular/core";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { environment } from '../environments/environment';

@Pipe({
    name: 'movieThumbnail',
    standalone: true
})
export class MovieThumbnailPipe implements PipeTransform {
    async transform(thumbnailPath: string): Promise<string> {
        try {
            const s3 = new S3Client({
                region: environment.S3_REGION,
                credentials: {
                    accessKeyId: environment.AWS_ID,
                    secretAccessKey: environment.AWS_SECRET
                }
            });
            const thumbnailResponse = await s3.send(new GetObjectCommand({
                Bucket: environment.S3_BUCKET,
                Key: thumbnailPath ? thumbnailPath : 'placeholders/movie_set_cropped.png'
            }));
            const thumbnailReader = await thumbnailResponse.Body?.transformToWebStream().getReader();
            const thumbnailBlob = new Blob([await thumbnailReader?.read().then((r) => r.value)]);
            s3.destroy();
            return URL.createObjectURL(thumbnailBlob);
        } catch (error) {
            console.error(error);
            return '';
        }
    }
}