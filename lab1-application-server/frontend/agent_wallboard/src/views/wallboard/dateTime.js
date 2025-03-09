import React, { useState, useEffect } from 'react'

export const DateTime = () => {
  const locale = 'en'
  //var [date,setDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Update every 1 second

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId)
  }, [])

  const formatDate = (date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${hours}:${minutes}      ${day}/${month}/${year}`
  }

  return <div className="dateTime">{formatDate(currentTime)}</div>
}

export default DateTime
