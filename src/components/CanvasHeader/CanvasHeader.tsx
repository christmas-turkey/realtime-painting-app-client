import React from 'react'
import { InputNumber, Popover } from 'antd'
import {RedoOutlined, DeleteOutlined} from "@ant-design/icons"
import { ColorResult, SketchPicker } from 'react-color'
import { useActions } from '../../hooks/useActions'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import "./CanvasHeader.scss"


const CanvasHeader: React.FC = () => {
  const actions = useActions()
  const {drawer, parameters} = useTypedSelector(state => state.canvas)

  const onFillColor = (color: ColorResult) => {
    actions.canvas.setDrawerParameters({fillColor: color.hex})
  }

  const onStrokeColor = (color: ColorResult) => {
    actions.canvas.setDrawerParameters({strokeColor: color.hex})
  }

  const onStrokeWidth = (width: number) => {
    actions.canvas.setDrawerParameters({strokeWidth: width})
  }

  const onClearCanvas = () => {
    if (drawer) {
      drawer.clearCanvas()
    }
  }

  const onUndo = () => {
    if (drawer) {
      drawer.undo()
    }
  }

  return (
    <div className='canvas-header'>
        <div className='canvas-header__parameters-bar'>
            <div className='parameters-bar__group'>
                <div className='parameters-bar__label'>Fill:</div>
                <Popover 
                    content={<SketchPicker color={parameters.fillColor} 
                    onChangeComplete={onFillColor} />}
                    trigger={["click"]}>
                    <button style={{backgroundColor: parameters.fillColor}} className='parameters-bar__color-picker'></button>
                </Popover>
            </div>
            <div className='parameters-bar__group'>
                <div className='parameters-bar__label'>Stroke:</div>
                <Popover 
                    content={<SketchPicker color={parameters.strokeColor} 
                    onChangeComplete={onStrokeColor} />}
                    trigger={["click"]}>
                    <button style={{backgroundColor: parameters.strokeColor}} className='parameters-bar__color-picker'></button>
                </Popover>
                <InputNumber 
                    className='parameters-bar__number-input'
                    formatter={(value) => `${value} px`}
                    parser={(value) => +value!.replace(' px', '')}
                    min={0} 
                    max={50}
                    placeholder='Width'
                    onChange={(value) => onStrokeWidth(value!)} 
                    value={parameters.strokeWidth} />
            </div>
        </div>
        <div className='canvas-header__options-buttons'>
          <button 
            onClick={onUndo} 
            className='options-buttons__item transition'>
            <RedoOutlined />
          </button>
          <button 
            onClick={onClearCanvas} 
            className='options-buttons__item options-buttons__clear transition'>
            <DeleteOutlined />
          </button>
        </div>
    </div>
  )
}

export default CanvasHeader