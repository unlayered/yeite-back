import aws from 'aws-sdk';
import config from 'config'

const s3 = new aws.S3({
    endpoint: new aws.Endpoint(config.get('s3-uri')),//'http://localhost:9000'), // for docker
    credentials: {
      accessKeyId: config.get('s3-id'), //'root', // MINIO_ROOT_USER
      secretAccessKey: config.get('s3-secret') //'password',// 'XhaLEDlRO9Gta5xWec3k', // MINIO_ROOT_PASSWORD
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

/* RUN MINIO PROCESS TO EMULATE S3 LOCALLY

data % docker run \
    -p 9000:9000 \
    -p 9090:9090 \
    --name minio \
    -v ~/minio/data:/data \
    -e "MINIO_ROOT_USER=root" \
    -e "MINIO_ROOT_PASSWORD=password" \
    quay.io/minio/minio server /data --console-address ":9090"

*/