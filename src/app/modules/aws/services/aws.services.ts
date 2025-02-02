import fs from 'fs'; // Import for asynchronous file reading
import { S3 } from 'aws-sdk';

// Load environment variables with type safety
export const bucketName = process.env.AWS_BUCKET_NAME as string;
export const region = process.env.AWS_BUCKET_REGION as string;
export const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY as string;
export const secretAccessKey = process.env.AWS_BUCKET_SECRET_KEY as string;

// Configure S3 client
export const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// Improved uploadFile function
export async function uploadFile(file: any): Promise<any> {
  try {
    const fileStream = fs.createReadStream(file.path);
    const fileExtension = file.mimetype.split('/')[1];
    const key = `${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'private', // File is private
    };

    const result = await s3.upload(uploadParams).promise();
    return { ...result, Key: key };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export function generateSignedUrl(key: string): string {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 900,
  };
  return s3.getSignedUrl('getObject', params);
}

export async function scheduleFileDeletion(key: string, delayInSeconds: number) {
  setTimeout(async () => {
    try {
      await s3.deleteObject({ Bucket: bucketName, Key: key }).promise();
      console.log(`Deleted file: ${key}`);
    } catch (error) {
      console.error(`Error deleting file ${key}:`, error);
    }
  }, delayInSeconds * 1000);
}


export async function deleteFile(Key: any): Promise<boolean> {
  try {
    const deleteParams = {
      Bucket: bucketName,
      Key
    };
    const isDelete = await s3.deleteObject(deleteParams).promise();
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}


