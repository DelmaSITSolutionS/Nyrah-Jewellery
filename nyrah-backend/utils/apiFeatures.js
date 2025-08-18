class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // Express req.query
  }

  // 1. Filtering
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 👉 Handle availability manually based on stock
    if (queryObj["availability"] === "1") {
      queryObj.stock = { $gt: 0 }; // in stock
      delete queryObj["availability"];
    } else if (queryObj["availability"] === "0") {
      queryObj.stock = 0; // out of stock
      delete queryObj["availability"];
    }

    // Advanced filter operators like gte, lte
    let queryStr = JSON.stringify(queryObj).replace(/filter\./g, "");
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 2. Sorting
  sort() {
    const sortKey = this.queryString.sort_by;

    const sortOptions = {
      "title-ascending": { name: 1 },
      "title-descending": { name: -1 },
      "price-ascending": { price: 1 },
      "price-descending": { price: -1 },
      "created-ascending": { createdAt: 1 },
      "created-descending": { createdAt: -1 },
    };

    if (sortKey && sortOptions[sortKey]) {
      this.query = this.query.sort(sortOptions[sortKey]);
    } else {
      // Default sorting
      this.query = this.query.sort({ createdAt: -1 });
    }

    return this;
  }

  // 3. Pagination (optional if needed later)
  paginate(resPerPage) {
    const page = Number(this.queryString.page) || 1;
    const skip = resPerPage * (page - 1);

    this.query = this.query.skip(skip).limit(resPerPage);
    return this;
  }
}

module.exports = APIFeatures;
