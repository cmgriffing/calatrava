import * as dotenv from "dotenv";
dotenv.config();
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY, STORAGE_BUCKET } = process.env;

const s3 = new S3Client({
  credentials: {
    accessKeyId: STORAGE_ACCESS_KEY,
    secretAccessKey: STORAGE_SECRET_KEY,
  },
  region: "us-west-2",
});

export async function getPresignedUrl(objectKey: string) {
  const presignedUrlCommand = new GetObjectCommand({
    Bucket: STORAGE_BUCKET,
    Key: objectKey,
  });

  const presignedUrl = await getSignedUrl(s3, presignedUrlCommand, {
    expiresIn: 3600,
  });

  return presignedUrl;
}
