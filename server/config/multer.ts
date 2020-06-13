import multer from 'multer';
import path = require('path');
import crypto from 'crypto';
export default {
    storage:multer.diskStorage({
        destination: path.resolve('public/uploads'),
        filename(req,file,callback) {
            const hash = crypto.randomBytes(6).toString('hex');
            const fileName = `${hash}-${file.originalname}`;
            callback(null,fileName);
        }
    })
}