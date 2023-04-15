import React from 'react'
import error from "../assets/svg/error.svg"
function Error() {
  return (
    <div className='chat-tab-container pattern-background black-pattern'>
      <div className='  error-message-box retro-border-box white-box menu-box '>
        <div className='error-container'>
          <img className='error-container-image' src = {error} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Error