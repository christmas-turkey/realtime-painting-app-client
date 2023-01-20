import React from 'react'
import {GithubFilled, CopyFilled} from '@ant-design/icons'
import { message, Tooltip } from 'antd'
import ToolsMenu from '../ToolsMenu/ToolsMenu'
import "./Sidebar.scss"
import { useTypedSelector } from '../../hooks/useTypedSelector'


const Sidebar: React.FC = () => {
  const {users} = useTypedSelector(state => state.users)

  const onCopyLink = () => {
    message.success("Room link copied")
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className='sidebar'>
      <div className='sidebar__online'>{1 + Object.values(users).length}</div>
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