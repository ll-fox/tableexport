const AV = require('leancloud-storage')

AV.init({
  appId: 'RgJnG8EpuIlP35di6d98C8sK-MdYXbMMI',
  appKey: '5jaazvJechfzPLn2dsCcelj4',
  serverURL: 'https://rgjng8ep.api.lncldglobal.com'
})

const addItem = async (val) => {
  const QA = AV.Object.extend('QA')
  const qa = new QA()
  try {
    qa.set(val)
    const res = await qa.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const updateItem = async (val, id) => {
  const QA = AV.Object.createWithoutData('QA', id)
  try {
    QA.set('num', 10)
    const res = await QA.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchTable = async () => {
  const QA = new AV.Query('QA')
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

export { addItem, fetchTable, updateItem }
