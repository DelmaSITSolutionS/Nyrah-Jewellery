const cloudinary = require("../config/cloudinary");

/**
 * Upload an array of buffers to Cloudinary.
 * @param {Array<{buffer: Buffer, originalname: string}>} files
 * @param {String} folder    Cloudinary folder, e.g. "metal-tones"
 * @returns {Promise<Array<{url: String, public_id: String}>>}
 */
const uploadMany = async function uploadMany(files = [], folder = "") {
  const uploads = files.map((file) => {
    const timestamp = Date.now();
    const nameWithoutExt = file.originalname.split(".")[0];
    const uniqueName = `${nameWithoutExt}-${timestamp}`;

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "Products",
            public_id: uniqueName,
            overwrite: false, // make sure we don't overwrite accidentally
          },
          (err, result) => {
            if (err) return reject(err);
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        )
        .end(file.buffer);
    });
  });

  return Promise.all(uploads);
};

const uploadSingleImageToCloudinary = async (file, folder = "") => {
  const timestamp = Date.now();
  const nameWithoutExt = file.originalname.split(".")[0];
  const uniqueName = `${nameWithoutExt}-${timestamp}`;
  const isVideo = file.mimetype.startsWith("video/");

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: uniqueName,
          overwrite: false,
          resource_type: isVideo ? "video" : "image",
        },
        (error, result) => {
          if (error) return reject(error);
          // ✅ Always return secure_url
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
          }); // return full result
        }
      )
      .end(file.buffer);
  });
};

module.exports = { uploadMany, uploadSingleImageToCloudinary };
