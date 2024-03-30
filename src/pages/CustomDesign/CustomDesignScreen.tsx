
import React from 'react'
import CanvasModel from '../../canvas/CanvasModel'
import Designer from './Designer/Designer'
import ImageEditor from './Designer/ImageEditor'


function CustomDesignScreen() {

  return (
    <main className='mainContent'>
      <Designer />
      <CanvasModel />
      <ImageEditor />
    </main>
  )
}

export default CustomDesignScreen