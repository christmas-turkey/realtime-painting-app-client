import React, {useState, useEffect} from 'react'
import Icon from "@ant-design/icons"
import { Tooltip } from 'antd'
import {ReactComponent as BrushIcon} from "../../assets/brush.svg"
import {ReactComponent as RectangleIcon} from "../../assets/rectangle.svg"
import {ReactComponent as EllipseIcon} from "../../assets/ellipse.svg"
import {ReactComponent as PentagonIcon} from "../../assets/pentagon.svg"
import {ReactComponent as LineIcon} from "../../assets/line.svg"
import {ReactComponent as TriangleIcon} from "../../assets/triangle.svg"
import Drawer from '../../utils/Drawer'
import cn from "classnames"
import { useTypedSelector } from '../../hooks/useTypedSelector'
import "./ToolsMenu.scss"


interface ToolsMenuItemType {
    index: number,
    icon: React.ReactElement,
    title: string,
    callback: (drawer: Drawer) => void
  }
  
const items: ToolsMenuItemType[] = [
  {
    index: 0,
    title: "Brush",
    icon: <Icon component={BrushIcon} />,
    callback: (drawer: Drawer) => {
      drawer.brush()
    }
  },
  {
    index: 1,
    title: "Ellipse",
    icon: <Icon component={EllipseIcon} />,
    callback: (drawer: Drawer) => {
      drawer.ellipse()
    }
  },
  {
    index: 2,
    title: "Triangle",
    icon: <Icon component={TriangleIcon} />,
    callback: (drawer: Drawer) => {
      drawer.polygon(3)
    }
  },
  {
    index: 3,
    title: "Rectangle",
    icon: <Icon component={RectangleIcon} />,
    callback: (drawer: Drawer) => {
      drawer.polygon(4)
    }
  },
  {
    index: 4,
    title: "Pentagon",
    icon: <Icon component={PentagonIcon} />,
    callback: (drawer: Drawer) => {
      drawer.polygon(5)
    }
  },
  {
    index: 5,
    title: "Line",
    icon: <Icon component={LineIcon} />,
    callback: (drawer: Drawer) => {
      drawer.line()
    }
  },
]
  

const ToolsMenu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const {drawer, parameters} = useTypedSelector(state => state.canvas)

  useEffect(() => {
    if (drawer) {
      items[activeIndex].callback(drawer)
    }
  }, [drawer, activeIndex, ...Object.values(parameters)])

  const onSelectItem= (item: ToolsMenuItemType) => {
    setActiveIndex(item.index)
  }

  return (
    <div className='tools-menu'>
        {items.map(item => (
          <Tooltip key={item.index} placement='right' title={item.title}>
            <button 
              onClick={() => onSelectItem(item)} 
              className={cn("tools-menu__item transition", {
                "active": item.index === activeIndex
              })}>
              {item.icon}
            </button>
          </Tooltip>
        ))}
    </div>
  )
}

export default ToolsMenu