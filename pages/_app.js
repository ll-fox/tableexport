import Head from 'next/head'
import MyContext from '../lib/context'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { currentUser } from './api/user'
import { fetchProject} from './api/project'
import '../styles/globals.css'
import 'antd/dist/antd.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // 1. 创建 state ，保存用户信息
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState(null)
  const [selectProject, setSelectProject] = useState('')
  const router = useRouter()

  useEffect(() => {
    currentUser().then((currentUser) => {
      if (currentUser) {
        setUser(currentUser.toJSON())
        router.push('/')
      } else {
        router.push('/login')
      }
    })
    fetchProject().then(res=>{
      setProjects(res)
      setSelectProject((res || [])[0]?.objectId)
    })
  }, [])

  return (
    <>
      <Head>
        <title>金翁农业</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
      </Head>
      <MyContext.Provider
        value={{
          user: user,
          projects: projects,
          setUser,
          selectProject,
          setSelectProject
        }}
      >
        <Component {...pageProps} />
      </MyContext.Provider>
    </>
  )
}

export default MyApp
