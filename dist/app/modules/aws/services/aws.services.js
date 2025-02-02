"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.scheduleFileDeletion = exports.generateSignedUrl = exports.uploadFile = exports.s3 = exports.secretAccessKey = exports.accessKeyId = exports.region = exports.bucketName = void 0;
const fs_1 = __importDefault(require("fs")); // Import for asynchronous file reading
const aws_sdk_1 = require("aws-sdk");
// Load environment variables with type safety
exports.bucketName = process.env.AWS_BUCKET_NAME;
exports.region = process.env.AWS_BUCKET_REGION;
exports.accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY;
exports.secretAccessKey = process.env.AWS_BUCKET_SECRET_KEY;
// Configure S3 client
exports.s3 = new aws_sdk_1.S3({
    region: exports.region,
    accessKeyId: exports.accessKeyId,
    secretAccessKey: exports.secretAccessKey,
});
// Improved uploadFile function
function uploadFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileStream = fs_1.default.createReadStream(file.path);
            const fileExtension = file.mimetype.split('/')[1];
            const key = `${Date.now()}-${file.originalname}`;
            const uploadParams = {
                Bucket: exports.bucketName,
                Body: fileStream,
                Key: key,
                ContentType: file.mimetype,
                ACL: 'private', // File is private
            };
            const result = yield exports.s3.upload(uploadParams).promise();
            return Object.assign(Object.assign({}, result), { Key: key });
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    });
}
exports.uploadFile = uploadFile;
function generateSignedUrl(key) {
    const params = {
        Bucket: exports.bucketName,
        Key: key,
        Expires: 900,
    };
    return exports.s3.getSignedUrl('getObject', params);
}
exports.generateSignedUrl = generateSignedUrl;
function scheduleFileDeletion(key, delayInSeconds) {
    return __awaiter(this, void 0, void 0, function* () {
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield exports.s3.deleteObject({ Bucket: exports.bucketName, Key: key }).promise();
                console.log(`Deleted file: ${key}`);
            }
            catch (error) {
                console.error(`Error deleting file ${key}:`, error);
            }
        }), delayInSeconds * 1000);
    });
}
exports.scheduleFileDeletion = scheduleFileDeletion;
function deleteFile(Key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteParams = {
                Bucket: exports.bucketName,
                Key
            };
            const isDelete = yield exports.s3.deleteObject(deleteParams).promise();
            return true;
        }
        catch (error) {
            console.error("Error deleting file:", error);
            return false;
        }
    });
}
exports.deleteFile = deleteFile;
