import React from 'react'
import { CallStatusContainer } from './style'
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback'
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'

const CallStatus = ({ OnlineAgentList, CallAgentSummaries, ServiceCode, CallQueueList }) => {
  let callOffer = 0
  let CallAbandon = 0

  Object.keys(CallAgentSummaries).map((queueName) => {
    const item = CallAgentSummaries[queueName]

    if (ServiceCode === 'ALL') {
      callOffer += parseInt(item.CallOffer)
      CallAbandon += parseInt(item.CallAbandon)
    } else if (ServiceCode === queueName) {
      callOffer += parseInt(item.CallOffer)
      CallAbandon += parseInt(item.CallAbandon)
    }
  })

  let Counter = 0

  if (ServiceCode === 'ALL') {
    Counter = OnlineAgentList.length
  } else {
    const list = OnlineAgentList.filter((item) => {
      return item.Queue === ServiceCode
    })

    Counter = list.length
  }

  let QueueCounter = 0

  if (ServiceCode === 'ALL') {
    CallQueueList.map((item) => {
      QueueCounter += parseInt(item.ConcurrentCall)
    })
  } else {
    CallQueueList.map((item) => {
      if (item.Queue === ServiceCode) {
        QueueCounter += parseInt(item.ConcurrentCall)
      }
    })
  }

  return (
    <CallStatusContainer>
      <div className="offerCall group">
        <div className="label">Offer Call</div>
        <div className="counter">
          <div className="icon">
            <PhoneCallbackIcon />
          </div>
          <div className="statis">{callOffer}</div>
        </div>
      </div>
      <div className="abandon_call group">
        <div className="label">Abandon Call</div>
        <div className="counter">
          <div className="icon">
            <PhoneMissedIcon />
          </div>
          <div className="statis">{CallAbandon}</div>
        </div>
      </div>
      <div className="logged_agent group">
        <div className="label">Agents</div>
        <div className="counter">
          <div className="icon">
            {' '}
            <RecordVoiceOverIcon />{' '}
          </div>
          <div className="statis">{Counter}</div>
        </div>
      </div>

      <div className="total_call_queue group">
        <div className="label"> Total Queue</div>
        <div className="counter">
          <div className="icon"> </div>
          <div className="statis">{QueueCounter}</div>
        </div>
      </div>
    </CallStatusContainer>
  )
}

export default CallStatus
