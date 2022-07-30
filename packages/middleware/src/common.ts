import { HttpResponse } from "@architect/functions";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const commonHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE,OPTIONS",
  "access-control-allow-headers": "content-type,authorization",
  "cache-control": "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
  "content-type": "application/json",
};

export function attachCommonHeaders(
  response: HttpResponse,
  customHeaders: Record<string, string> = {}
): HttpResponse {
  response.headers = {
    ...(response.headers || {}),
    ...commonHeaders,
    ...customHeaders,
  };

  (response as any).cors = true;
  return response;
}

export function createAttachCommonHeaders(
  globalHeaders: Record<string, string> = {}
) {
  return function (
    response: HttpResponse,
    customHeaders: Record<string, string>
  ) {
    return attachCommonHeaders(response, {
      ...globalHeaders,
      ...customHeaders,
    });
  };
}

export function createGetPresignedUrl(
  STORAGE_ACCESS_KEY: string,
  STORAGE_SECRET_KEY: string,
  STORAGE_BUCKET: string
) {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: STORAGE_ACCESS_KEY,
      secretAccessKey: STORAGE_SECRET_KEY,
    },
    region: "us-west-2",
  });

  return async function getPresignedUrl(objectKey: string) {
    const presignedUrlCommand = new GetObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: objectKey,
    });

    const presignedUrl = await getSignedUrl(s3, presignedUrlCommand, {
      expiresIn: 3600,
    });

    return presignedUrl;
  };
}
