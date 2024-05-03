import React, { useEffect } from 'react'
import { useGetUsers } from '../../hook/useGetUsers'
import { snackVar } from '../../constants/snackVar'
import { authVar } from '../../constants/authVar'
import { useReactiveVar } from '@apollo/client'
import { router } from '../Routes'

interface GuardProps {
    children: JSX.Element
}

const excludedRoutes = ["/upload"]

const Guard = ({ children }: GuardProps) => {
  const { data: user, error } = useGetUsers() 
  const isAuthicated = useReactiveVar(authVar)
  console.log(`[[Guard]] > isAuthicated: `, isAuthicated)

  useEffect(() => {
    if (error) {
        router.navigate('/upload')
    }
  }, [error])

  useEffect(() => {
    if (error) {
        if (error.networkError) {
            snackVar({ message: "네트워크 에러가 발생했습니다.", type: 'error' })
        } else if (!excludedRoutes.includes(window.location.pathname)) {
            snackVar({ message: error.message, type: 'error' })
        }
    }
  }, [error])

  return (
    <>
    { 
        excludedRoutes.includes(window.location.pathname) 
        ? children
        : user && children 
    }
    </>
  )
}

export default Guard