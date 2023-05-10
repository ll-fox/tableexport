import React, { useRef, useState, useEffect, useContext } from 'react'
import { Spin } from 'antd'
import dynamic from 'next/dynamic'
import { find } from 'loadsh'
const Line = dynamic(
  () => import('@ant-design/charts').then(({ Line }) => Line),
  { ssr: false }
)
const Pie = dynamic(() => import('@ant-design/charts').then(({ Pie }) => Pie), {
  ssr: false
})
import App from './components/Layout/index'
import MyContext from '../lib/context'
import style from '../styles/Home.module.css'
import {
  fetchMaterialStorage,
} from './api/materialStorage'
import { fetchOutStorage } from './api/outStorage'

const Home = () => {
  const { selectProject, projects } = useContext(MyContext)
  const [data, setData] = useState([])
  const [pieData, setPieData] = useState([])
  const [loading, setLodaing] = useState(true)
  const project = find(projects, { objectId: selectProject })
  const { expend = 0, sale = 0 } = project || {}
  const earnings = sale - expend
  useEffect(() => {
    setLodaing(true)
    asyncFetch()
  }, [selectProject])


  const asyncFetch = async () => {
    const outStorageData = await fetchOutStorage('', selectProject)
    const materialStorageData = await fetchMaterialStorage('', selectProject)
    outStorageData.map(item=>{
      item.category = '收入'
    })
    materialStorageData.map((item) => {
      item.category = '支出'
    })
    const data = outStorageData.concat(materialStorageData)
    setData(data)

    const pie = [
      {
        type: '总支出',
        value: expend
      },
      {
        type: '总销售额',
        value: sale
      }
    ]
    setPieData(pie)
    setLodaing(false)
  }

  const config = {
    data,
    xField: 'date',
    yField: 'price',
    seriesField: 'category',
    xAxis: {
      type: 'time'
    },
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
      }
    }
  }

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14
      }
    },
    interactions: [
      {
        type: 'element-selected'
      },
      {
        type: 'element-active'
      }
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        content: `收益\n${earnings}¥`
      }
    }
  }



  return (
    <App tab={'home'}>
      <Spin size="large" spinning={loading}>
        <div className={style.content}>
          <div className={style.item}>
            <Line {...config} />
          </div>
          <div className={style.item}>
            <Pie {...pieConfig} />
          </div>
        </div>
      </Spin>
    </App>
  )
}

export default Home
