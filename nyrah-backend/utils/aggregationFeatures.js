class AggregationFeatures {
  constructor(queryPipeline, queryString) {
    this.pipeline = queryPipeline; // MongoDB aggregation pipeline array
    this.queryString = queryString; // req.query
  }

  // 1. Filtering (price, stock/availability)
  filter() {
    const matchStage = {};

    if (this.queryString["filter.price.gte"]) {
      matchStage.price = { ...matchStage.price, $gte: Number(this.queryString["filter.price.gte"]) };
    }

    if (this.queryString["filter.price.lte"]) {
      matchStage.price = { ...matchStage.price, $lte: Number(this.queryString["filter.price.lte"]) };
    }

    if (this.queryString.availability === "1") {
      matchStage.stock = { $gt: 0 };
    } else if (this.queryString.availability === "0") {
      matchStage.stock = 0;
    }

    if (Object.keys(matchStage).length > 0) {
      this.pipeline.push({ $match: matchStage });
    }

    return this;
  }

  forceSortBeforeGroup(field = "createdAt", order = 1) {
    this.pipeline.push({ $sort: { [field]: order } });
    return this;
  }

  // 2. Sorting
  sortAfterGroup() {
    const sortKey = this.queryString.sort_by;

    const sortOptions = {
      "title-ascending": { name: 1 },
      "title-descending": { name: -1 },
      "price-ascending": { price: 1 },
      "price-descending": { price: -1 },
      "created-ascending": { createdAt: 1 },
      "created-descending": { createdAt: -1 },
    };

    const sortStage = sortOptions[sortKey] || { createdAt: -1 };
    this.pipeline.push({ $sort: sortStage });

    return this;
  }

  // 3. Pagination
  paginate(resPerPage = 12) {
    const page = Number(this.queryString.page) || 1;
    
    const skip = resPerPage * (page - 1);
    

    this.pipeline.push({ $skip: skip }, { $limit: resPerPage });
    return this;
  }

  build() {
    return this.pipeline;
  }
}

module.exports = AggregationFeatures;