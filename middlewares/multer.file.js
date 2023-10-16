import xlsx from 'xlsx'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    // Set the maximum file size to 10MB (in bytes)
    fileSize: 10 * 1024 * 1024
  }
}).single('file');

function readFileData(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(200).json({ status:500,error: true, message: 'File upload error', data: {} });
    } else if (err) {
      console.error(err);
      return res.status(200).json({  status:500,error: true, message: 'Server error', data: {} });
    }

    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }

      const allowedFileTypes = ['xlsx', 'csv'];
      const fileType = req.file.originalname.split('.').pop().toLowerCase();

      if (!allowedFileTypes.includes(fileType)) {
        throw new Error('Invalid file type');
      }

      const options = {
        cellDates: true // enable cellDates option
      };

      const workbook = xlsx.read(req.file.buffer);
      const sheetName = workbook.SheetNames[0]; // assume first sheet
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet, options);
      req.data = data;
      next();
    } catch (error) {
      console.error(error);
      return res.status(200).json({ status:500, error: true, message: error.message, data: {} });
    }
  });
}

export default readFileData