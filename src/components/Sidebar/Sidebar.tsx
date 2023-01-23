import React, { useEffect, useState } from 'react'
import {GithubFilled, CopyFilled} from '@ant-design/icons'
import { message, Tooltip } from 'antd'
import ToolsMenu from '../ToolsMenu/ToolsMenu'
import socket from '../../core/socket'
import { UsersType } from '../../types/types'
import copy from "clipboard-copy"
import "./Sidebar.scss"


const Sidebar: React.FC = () => {
  const [numberOfUsers, setNumberOfUsers] = useState(1)

  useEffect(() => {
    socket.on("USER_JOINT", (users: UsersType) => {
      setNumberOfUsers(Object.values(users).length)
    })

    socket.on("USER_LEFT", (users: UsersType) => {
      setNumberOfUsers(Object.values(users).length)
    })
  }, [])

  const onCopyLink = () => {
    message.success("Room link copied")
    copy(window.location.href)
  }

  return (
    <div className='sidebar'>
      <div className='sidebar__online'>{numberOfUsers}</div>
      <ToolsMenu />
      <div className='sidebar__bottom'>
        <Tooltip placement='right' title="Copy room link">
          <button onClick={onCopyLink} className='sidebar__copy-link transition'>
            <CopyFilled />
          </button>
        </Tooltip>
        <a className='sidebar__github' href='https://github.com/'>
          <GithubFilled />
        </a>
      </div>
    </div>
  )
}

export default Sidebar