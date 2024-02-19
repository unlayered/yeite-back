import aws from 'aws-sdk';
import config from 'config'

const s3 = new aws.S3({
    endpoint: new aws.Endpoint(config.get('s3-uri')),
    credentials: {
      accessKeyId: config.get('s3-id'), // 'root' // MINIO_ROOT_USER
      secretAccessKey: config.get('s3-secret') // 'XhaLEDlRO9Gta5xWec3k' // MINIO_ROOT_PASSWORD
    },
    s3ForcePathStyle: true, // important
    signatureVersion: 'v4'
  });

export async function generateUploadURL( fileName, contentType, bucketName  ){
    const params = ({
        Bucket : bucketName, //'yeite-original-audio',
        Key: fileName,
        Expires: 360,
        ContentType : contentType
    });

    return await s3.getSignedUrlPromise('putObject', params);
}

export default {
  generateUploadURL,
}