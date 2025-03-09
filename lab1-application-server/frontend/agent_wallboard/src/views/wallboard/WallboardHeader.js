import React from 'react'
import { Header } from './style'
import { useState } from 'react'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import DateTime from './dateTime'

import wallboard_logo from './../../assets/images/react.jpg'

const WallboardHeader = ({ title, serviceChange, ServiceCode }) => {
  const [age, setAge] = React.useState('10')

  const serviceCode = [
    'ALL',
    'Team1',
    'Team2',
    'Team3',
    'Team4',
    'Team5',
    'Team6',
    'Team7',
    'Team8',
    'Team9',
  ]

  const handleChange = (event) => {
    setAge(event.target.value)
    serviceChange(event.target.value)
  }

  return (
    <Header>
      <div className="wallboard_logo">
        <img src={wallboard_logo} />
      </div>
      <div className="wallboard_title">{title}</div>
      <div className="datetimes">
        <DateTime></DateTime>
      </div>
      <div className="wallboard_queue">
        <div className="queue_title">Call Queue</div>
        <div>
          <FormControl sx={{ width: '150px', background: '#ffffff' }}>
            <Select value={ServiceCode} onChange={handleChange}>
              {serviceCode.map((item) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </Header>
  )
}

export default WallboardHeader
