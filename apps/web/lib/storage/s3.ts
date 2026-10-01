import { CreateBucketCommand, HeadBucketCommand, PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucket = process.env.S3_BUCKET;

export function getS3Client() {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('Configure S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID e S3_SECRET_ACCESS_KEY.');
  }
  return new S3Client({
    region: process.env.S3_REGION ?? 'us-east-1',
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function getPhotoBucket() {
  if (!bucket) throw new Error('S3_BUCKET não está configurado.');
  return bucket;
}

export async function ensurePhotoBucket() {
  const client = getS3Client();
  try {
    await client.send(new HeadBucketCommand({ Bucket: getPhotoBucket() }));
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: getPhotoBucket() }));
  }
  const allowedOrigin = new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000').origin;
  await client.send(new PutBucketCorsCommand({
    Bucket: getPhotoBucket(),
    CORSConfiguration: {
      CORSRules: [{
        AllowedOrigins: [allowedOrigin],
        AllowedMethods: ['GET', 'HEAD', 'PUT'],
        AllowedHeaders: ['*'],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3600,
      }],
    },
  }));
}

export { getSignedUrl };
export { S3Client };
