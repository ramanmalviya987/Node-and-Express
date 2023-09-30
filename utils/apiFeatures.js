class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObje = { ...this.queryString };
    const extendedValue = ['sort', 'limit', 'page', 'fields'];
    extendedValue.forEach((el) => delete queryObje[el]);

    let queryString = JSON.stringify(queryObje);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // { difficulty: 'easy', duration: { $gte: '5' } }
    // { difficulty: 'easy', duration: { gte: '5' } }

    this.query = this.query.find(JSON.parse(queryString));
    // let query = Tour.find(JSON.parse(queryString));

    return this;
  }
  sort() {
    // 2. Sortingß

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitField() {
    // 3. limiting field

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4. Paginations

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeature;
