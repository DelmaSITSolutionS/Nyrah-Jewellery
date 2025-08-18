const optimizeImage = (url, width = 400, quality = "auto:eco") => {
  if (!url?.includes("/upload/")) return url;
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_${quality},w_${width},c_fill/`
  );
};

export default optimizeImage