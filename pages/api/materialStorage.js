const AV = require('leancloud-storage')

const addSupplier = async (val) => {
  const Supplier = AV.Object.extend('Supplier')
  const supplier = new Supplier()
  try {
    supplier.set('name', val)
    const res = await supplier.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchSupplier = async () => {
  const QA = new AV.Query('Supplier')
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
const addMaterialStorage = async (val) => {
  const MaterialStorage = AV.Object.extend('MaterialStorage')
  const material = new MaterialStorage()
  try {
    material.set(val)
    const res = await material.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const updateMaterialStorage = async (val, id) => {
  const MaterialStorage = AV.Object.createWithoutData('MaterialStorage', id)
  try {
    MaterialStorage.set(val)
    const res = await MaterialStorage.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchMaterialStorage = async (val) => {
  const MaterialStorage = new AV.Query('MaterialStorage')
  try {
    if (val) {
      MaterialStorage.equalTo('supplier', val)
    }
    const data = await MaterialStorage.find()
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
  fetchMaterialStorage,
  updateMaterialStorage,
  addMaterialStorage,
  addSupplier,
  fetchSupplier
}
