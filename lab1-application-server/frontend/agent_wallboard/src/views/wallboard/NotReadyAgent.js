import React from 'react'
import { BsFillPersonFill } from 'react-icons/bs'

const agentStatus = {
  4: { status: 'Lunch', min: 60 },
  5: { status: 'Toilet', min: 30 },
  6: { status: 'Training', min: 60 },
  7: { status: 'Meeting', min: 60 },
  8: { status: 'Spicial Assigned,', min: 30 },
  9: { status: 'System down', min: false },
  10: { status: 'Coaching', min: false },
  11: { status: 'Sick', min: false },
  12: { status: 'Outbound Call', min: false },
  13: { status: 'Event', min: false },
  14: { status: 'Morning Break', min: false },
  15: { status: 'Afternoon Break', min: false },
}

export const msToTimeFor4 = (time, limit, agent, style, id, AgentStatusCode) => {
  console.log('msToTimeFor4[AgentStatusCode]: ', AgentStatusCode)

  var s = Date.now({ timeZone: 'Asia/Jakarta' }) - time
  var styleFont = 'text-secondary'
  var styleFontAgent = 'text-secondary d-inline-block text-truncate'
  function pad(n, z) {
    z = z || 2
    return ('00' + n).slice(-z)
  }
  if (limit != 'false') {
    if (parseInt(s) >= parseInt(limit) * 60000) {
      styleFont = style
      styleFontAgent = style + ' d-inline-block text-truncate'
    }
  }

  var ms = s % 1000
  s = (s - ms) / 1000
  var secs = s % 60
  s = (s - secs) / 60
  var mins = s % 60
  var hrs = (s - mins) / 60

  const status = AgentStatusCode ? agentStatus[AgentStatusCode] : false

  let color = '#333'
  if (status && status.min) {
    const min = status.min
    if (hrs > 1 || mins > min) {
      color = 'red'
    }
  }

  return (
    <tr key={id}>
      <td key={'F' + id}>
        <small className={styleFontAgent} style={{ maxWidth: '200px' }}>
          <div style={{ color: `${color}`, padding: 5, paddingTop: 10, fontSize: '14px' }}>
            <BsFillPersonFill /> {agent} {status ? `(${status.status})` : ''}{' '}
          </div>
        </small>
      </td>
      <td className="text-right" key={'S' + id}>
        <small>
          <span className={styleFont}>
            <div style={{ color: `${color}`, padding: 5, paddingTop: 10, fontSize: '14px' }}>
              {pad(hrs)}:{pad(mins)}:{pad(secs)}
            </div>
          </span>
        </small>
      </td>
    </tr>
  )
}

export const msToTime = (time, limit, agent, style, id) => {
  var s = Date.now({ timeZone: 'Asia/Jakarta' }) - time
  var styleFont = 'text-secondary'
  var styleFontAgent = 'text-secondary d-inline-block text-truncate'
  function pad(n, z) {
    z = z || 2
    return ('00' + n).slice(-z)
  }
  if (limit != 'false') {
    if (parseInt(s) >= parseInt(limit) * 60000) {
      styleFont = style
      styleFontAgent = style + ' d-inline-block text-truncate'
    }
  }

  var ms = s % 1000
  s = (s - ms) / 1000
  var secs = s % 60
  s = (s - secs) / 60
  var mins = s % 60
  var hrs = (s - mins) / 60

  return (
    <tr key={id}>
      <td key={'F' + id}>
        <small className={styleFontAgent} style={{ maxWidth: '200px' }}>
          <div style={{ color: '#333', padding: 5, paddingTop: 10, fontSize: '14px' }}>
            <BsFillPersonFill style={{ fontSize: '14px' }} /> {agent}
          </div>
        </small>
      </td>
      <td className="text-right" key={'S' + id}>
        <small>
          <span className={styleFont}>
            <div style={{ color: '#333', padding: 5, paddingTop: 10, fontSize: '14px' }}>
              {pad(hrs)}:{pad(mins)}:{pad(secs)}
            </div>
          </span>
        </small>
      </td>
    </tr>
  )
}
