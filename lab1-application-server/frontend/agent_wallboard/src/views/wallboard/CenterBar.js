import React from 'react'
import { CenterBarStyle } from './style'
import DateTime from './dateTime'
import Marquee from 'react-fast-marquee'

const CenterBar = ({ ServiceCode, WallBoardText }) => {
  const filteredItems = WallBoardText.filter((item) => item.Queue === ServiceCode)
  return (
    <CenterBarStyle>
      <div className="left">
        <div className="TextSlide">
          <div>
            <Marquee className="MarqueeText">
              {filteredItems.length > 0 ? filteredItems[0].BannerText : ''}
            </Marquee>
          </div>
        </div>
      </div>
    </CenterBarStyle>
  )
}

export default CenterBar
