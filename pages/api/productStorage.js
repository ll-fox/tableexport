const AV = require('leancloud-storage')

const addProductSupplier = async (val) => {
  const ProductSupplier = AV.Object.extend('ProductSupplier')
  const supplier = new ProductSupplier()
  try {
    supplier.set('name', val)
    const res = await supplier.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchProductSupplier = async () => {
  const QA = new AV.Query('ProductSupplier')
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
const addProductStorage = async (val) => {
  const ProductStorage = AV.Object.extend('ProductStorage')
  const productStorage = new ProductStorage()
  try {
    productStorage.set(val)
    const res = await productStorage.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const updateProductStorage = async (val, id) => {
  const ProductStorage = AV.Object.createWithoutData('ProductStorage', id)
  try {
    ProductStorage.set(val)
    const res = await ProductStorage.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchProductStorage = async (val) => {
  const ProductStorage = new AV.Query('ProductStorage')
  try {
    if (val) {
      ProductStorage.equalTo('supplier', val)
    }
    const data = await ProductStorage.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

export {
  fetchProductStorage,
  updateProductStorage,
  addProductStorage,
  addProductSupplier,
  fetchProductSupplier
}
