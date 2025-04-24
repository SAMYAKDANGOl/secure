import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import crypto from "crypto"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!

// Generate a unique key for the file
export function generateFileKey(userId: string, fileName: string): string {
  const timestamp = Date.now()
  const randomString = crypto.randomBytes(8).toString("hex")
  return `${userId}/${timestamp}-${randomString}-${fileName}`
}

// Encrypt file data
export function encryptFile(buffer: Buffer, key: string): { encryptedData: Buffer; iv: string } {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv)

  const encryptedData = Buffer.concat([cipher.update(buffer), cipher.final()])

  return {
    encryptedData,
    iv: iv.toString("hex"),
  }
}

// Decrypt file data
export function decryptFile(encryptedData: Buffer, key: string, iv: string): Buffer {
  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key, "hex"), Buffer.from(iv, "hex"))

  return Buffer.concat([decipher.update(encryptedData), decipher.final()])
}

// Upload file to S3
export async function uploadFile(buffer: Buffer, key: string, contentType: string, encrypt = true): Promise<string> {
  let fileBuffer = buffer
  let fileIv = ""

  // Encrypt the file if requested
  if (encrypt) {
    const encryptionKey = process.env.FILE_ENCRYPTION_KEY!
    const { encryptedData, iv } = encryptFile(buffer, encryptionKey)
    fileBuffer = encryptedData
    fileIv = iv
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    Metadata: {
      encrypted: encrypt ? "true" : "false",
      iv: fileIv,
    },
  }

  await s3Client.send(new PutObjectCommand(params))

  // Return the file key
  return key
}

// Get a signed URL for downloading a file
export async function getSignedDownloadUrl(key: string, fileName: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${encodeURIComponent(fileName)}"`,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

// Delete a file from S3
export async function deleteFile(key: string): Promise<void> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  }

  await s3Client.send(new DeleteObjectCommand(params))
}
