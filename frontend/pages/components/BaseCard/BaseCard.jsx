import React from 'react'

function BaseCard(props) {

  return (
    <div className="p-4 bg-cardbg rounded-xl drop-shadow hover:drop-shadow-lg outline outline-1 outline-cardoutline">
        {props.children}
    </div>
  )

}

BaseCard.defaultProps = {
    aspect: 'aspect-square',
}

export default BaseCard