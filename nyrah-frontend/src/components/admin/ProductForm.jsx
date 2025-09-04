import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createProduct, updateProduct } from "../../redux/apis/productApi";
import { Button } from "../Button";
import MultiSelectDropdown from "./MultiSelectDropdown";
import RingForm from "./DetailsForm/RingForm";
import BraceletForm from "./DetailsForm/BraceletForm";
import NecklaceForm from "./DetailsForm/NecklaceForm";
import EarringForm from "./DetailsForm/EarringForm";
import PendantForm from "./DetailsForm/PendantForm";

import imageCompression from "browser-image-compression";
import { IoIosClose } from "react-icons/io";

export default function ProductForm({
  initial = null,
  onSuccess,
  categories = [],
  materials = [],
}) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryMain: "ring",
      materialTag: "silver",
    },
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailInitial, setDetailInitial] = useState(null);
  const [loadImage, setLoadImage] = useState(false);
  const categoryMain = watch("categoryMain");
  const categorySub = watch("categorySub");
  const materialTag = watch("materialTag");
  const materialSub = watch("materialSub");

  useEffect(() => {
    if (initial && initial._id) {
      reset({
        _id: initial._id,
        name: initial.name || "",
        shortDescription: initial.shortDescription || "",
        price: initial.price || "",
        stock: initial.stock,
        categoryMain: initial.category?.main || "",
        categorySub: initial.category?.sub || [],
        materialTag: initial.material?.tag || "",
        materialSub: initial.material?.sub || [],
        productGroup: initial.productGroup || "",
      });

      setImages(initial.images || []);
      setVideo(initial.video || null);

      if (initial.category?.main?.toLowerCase()) {
        setDetailData(initial.detailsRef || {});
        setDetailInitial(initial.detailsRef);
      }
    }
  }, [initial, reset]);

  const handleDetailChange = useCallback((data) => {
    setDetailData(data);
  }, []);

  const handleImageChange = async (e) => {
    setLoadImage(true);
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      toast.error("Maximum 4 images");
      setLoadImage(false);
      return;
    }

    const compressedFiles = [];
    for (const file of files) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          const compressed = await imageCompression(file, {
            maxSizeMB: 9,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          compressedFiles.push(compressed);
        } else {
          compressedFiles.push(file);
        }
      } catch (err) {
        toast.error("Image compression failed");
        console.error("Compression error:", err);
      }
    }

    setImages((prev) => [...prev, ...compressedFiles]);
    setLoadImage(false);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const urls = images.map((img) =>
      typeof img === "string" ? img : URL.createObjectURL(img)
    );
    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const onSubmit = async (data) => {
    setSubmitting(true);

    const fd = new FormData();
    images.slice(0, 4).forEach((img, i) => {
      if (img instanceof Blob) {
        const filename = img.name ? img.name : `image-${i + 1}.jpg`;
        fd.append("images", img, filename);
      }
    });

    const existingImgs = images.filter((img) => typeof img === "string");
    if (existingImgs.length) {
      fd.append("existingImg", JSON.stringify(existingImgs));
    }

    if (video instanceof File) {
      fd.append("video", video);
    }

    fd.append("name", data.name);
    fd.append("shortDescription", data.shortDescription);
    fd.append("price", Number(data.price));
    fd.append("stock", Number(data.stock));

    fd.append("category[main]", data.categoryMain);
    data?.categorySub?.forEach((s, i) => fd.append(`category[sub][${i}]`, s));

    fd.append("material[tag]", data.materialTag);
    data?.materialSub?.forEach((s, i) => fd.append(`material[sub][${i}]`, s));

    fd.append("productGroup", data.productGroup);
    fd.append("detailsModel", capitalize(data.categoryMain));

    if (detailData) {
      const detailKey = `${data.categoryMain.toLowerCase()}Details`;
      fd.append(detailKey, JSON.stringify(detailData));
    }

    try {
      if (data._id) {
        fd.append("_id", data._id);
        await dispatch(updateProduct({ id: data._id, updates: fd })).unwrap();
        toast.success("Product updated");
      } else {
        await dispatch(createProduct(fd)).unwrap();
        toast.success("Product created");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const objectURLs = [];
    images.forEach((img) => {
      if (img instanceof File) {
        const url = URL.createObjectURL(img);
        objectURLs.push(url);
      }
    });

    if (video instanceof File) {
      const url = URL.createObjectURL(video);
      objectURLs.push(url);
    }

    return () => {
      objectURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images, video]);

  const renderDetailForm = () => {
    switch (categoryMain?.toLowerCase()) {
      case "ring":
        return (
          <RingForm initial={detailInitial} onChange={handleDetailChange} />
        );
      case "bracelet":
        return (
          <BraceletForm initial={detailInitial} onChange={handleDetailChange} />
        );
      case "necklace":
        return (
          <NecklaceForm initial={detailInitial} onChange={handleDetailChange} />
        );
      case "earring":
        return (
          <EarringForm initial={detailInitial} onChange={handleDetailChange} />
        );
      case "pendant":
        return (
          <PendantForm initial={detailInitial} onChange={handleDetailChange} />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="label">
          Name
        </label>
        <input
          autoComplete="false"
          id="name"
          className="input input-bordered w-full"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="shortDiscription" className="label">
          Short Description
        </label>
        <textarea
          id="shortDiscription"
          className="textarea textarea-bordered w-full"
          {...register("shortDescription", {
            required: "Description is required",
          })}
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="price" className="label">
            Price
          </label>
          <input
            id="price"
            type="number"
            className="input input-bordered w-full"
            {...register("price", { required: true, min: 0 })}
          />
        </div>
        <div>
          <label htmlFor="stock" className="label">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            className="input input-bordered w-full"
            {...register("stock", { min: 0 })}
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <label htmlFor="image" className="label">
          Images (max 4)
        </label>
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {!loadImage ? (
              imagePreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt="preview"
                    className="w-18 h-18 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    <IoIosClose />
                  </button>
                </div>
              ))
            ) : (
              <div className="w-16 h-16 skeleton"></div>
            )}
          </div>
        )}
        <input
          id="image"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full"
        />
      </div>

      {/* Video */}
      <div>
        <label htmlFor="video" className="label">
          Product Video
        </label>
        {video && typeof video !== "string" && video instanceof File && (
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-full max-h-40 mb-2 rounded"
          />
        )}
        {video && typeof initial?.video === "string" && initial.video && (
          <video
            src={initial.video}
            controls
            className="w-full max-h-40 mb-2 rounded"
          />
        )}
        <input
          id="video"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="file-input file-input-bordered w-full"
        />
      </div>

      {/* Category Main */}
      <div>
        <label htmlFor="mainCategory" className="label">
          Main Category
        </label>
        <select
          id="mainCategory"
          list="mainCats"
          className="input input-bordered w-full select capitalize"
          {...register("categoryMain", { required: true })}
        >
          {categories.map((c) => (
            <option className="capitalize" key={c.main} value={c.main}>
              {c.main}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategories */}
      <MultiSelectDropdown
        label="Subcategories"
        options={categories.find((c) => c.main === categoryMain)?.sub || []}
        selected={categorySub || []}
        onChange={(subs) => setValue("categorySub", subs)}
        disabled={!categoryMain}
        name="subCategories"
      />

      {/* Material Tag */}
      <div>
        <label htmlFor="materialTag" className="label">
          Material Tag
        </label>
        <select
          id="materialTag"
          list="materialTags"
          className="input input-bordered w-full select capitalize"
          {...register("materialTag", { required: true })}
        >
          {materials.map((c) => (
            <option key={c.tag} value={c.tag}>
              {c.tag}
            </option>
          ))}
        </select>
      </div>

      {/* Material Sub */}
      <MultiSelectDropdown
        label="tags"
        options={materials.find((c) => c.tag === materialTag)?.sub || []}
        selected={materialSub || []}
        onChange={(subs) => setValue("materialSub", subs)}
        disabled={!materialTag}
        name="materialSub"
      />

      {/* Product Group */}
      <div>
        <label htmlFor="productGroup" className="label">
          Product Group
        </label>
        <input
          id="productGroup"
          className="input input-bordered w-full"
          {...register("productGroup", { required: true })}
        />
      </div>

      {/* Details Form based on category */}
      {renderDetailForm()}

      <Button type="submit" disabled={submitting} className="w-full">
        {initial ? "Update" : "Create"} Product
      </Button>
    </form>
  );
}