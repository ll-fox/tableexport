const AV = require('leancloud-storage')


const fetchWarehouse = async () => {
  const Warehouse = new AV.Query('Warehouse')
  try {
    const data = await Warehouse.find()
    // console.log(111, data, data.toJSON())
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const addWarehouse = async (val) => {
  const Warehouse = AV.Object.extend('Warehouse')
  const warehouse = new Warehouse()
  try {
    warehouse.set('name', val)
    const res = await warehouse.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const destroyWarehouse = async (val) => {
  try {
    const warehouse = AV.Object.createWithoutData('Warehouse', val.objectId)
    warehouse.destroy()
  } catch (e) {
    console.log(e)
  }
}
export { addWarehouse, fetchWarehouse, destroyWarehouse }