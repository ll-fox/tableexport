const AV = require('leancloud-storage')

const addPlatform = async (val) => {
  const Platform = AV.Object.extend('Platform')
  const platform = new Platform()
  try {
    platform.set('name', val)
    const res = await platform.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchPlatform = async () => {
  const QA = new AV.Query('Platform')
  try {
    const data = await QA.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}
const addProduct = async (val) => {
  const Product = AV.Object.extend('Product')
  const product = new Product()
  try {
    product.set(val)
    const res = await product.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const updateProduct = async (val, id) => {
  const Product = AV.Object.createWithoutData('Product', id)
  try {
    Product.set(val)
    const res = await Product.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchProduct = async (val) => {
  const Product = new AV.Query('Product')
  try {
    if (val) {
      Product.equalTo('platform', val)
    }
    const data = await Product.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

export { fetchProduct, updateProduct, addProduct, addPlatform, fetchPlatform }
