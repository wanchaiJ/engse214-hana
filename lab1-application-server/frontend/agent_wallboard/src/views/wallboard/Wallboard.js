import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Container } from './style'
import Agentonline from './Agentonline'
import WallboardHeader from './WallboardHeader'
import CallStatus from './CallStatus'
import CenterBar from './CenterBar'
import ReactAudioPlayer from 'react-audio-player'

import wallboard_config from '../../wbconfig.js'

const wbconfig = wallboard_config.development

import { Parse } from 'parse'

export default class Wallboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      CallOffer: 0,
      CallAbandon: 0,
      AgentLogin: 0,
      CallQueue: 0,
      CallQueueList: [],
      OnlineAgentList: [],
      token: window.location.pathname,
      status: null,
      beep: '',
      checked: true,
      ServiceCode: 'ALL',
      CallAgentSummaries: [],
      WallboardBanner: [],
    }

    this.handleServiceCodeChange = this.handleServiceCodeChange.bind(this)
  }

  //--------------- Global Functions of OnlineAgentLists -------------

  getOnlineAgentList(AgentList) {
    const agent = AgentList.map((item) => ({
      AgentCode: item.get('AgentCode'),
      AgentName: item.get('AgentName') + '[' + item.get('Queue') + ']',
      AgentStatus: item.get('AgentStatus'),
      IsLogin: item.get('IsLogin'),
      Queue: item.get('Queue'),
      AgentStatusCode: item.get('AgentStatusCode'),
      AgentTime: Date.parse(item.get('startedAt')),
    }))

    this.setState({
      OnlineAgentList: agent,
    })
  }

  createOnlineAgentList(object) {
    let arr = this.state.OnlineAgentList

    if (parseInt(object.get('IsLogin')) === 1) {
      arr.push({
        AgentCode: object.get('AgentCode'),
        AgentName: object.get('AgentName') + '[' + object.get('Queue') + ']',
        AgentStatus: object.get('AgentStatus'),
        AgentStatusCode: object.get('AgentStatusCode'),
        AgentTime: Date.parse(object.get('startedAt')),
      })
    }

    this.setState({
      OnlineAgentList: arr,
    })
  }

  updateOnlineAgentList(object) {
    let arr = this.state.OnlineAgentList

    if (this.searchAgent(object.get('AgentCode')) === true) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].AgentCode === object.get('AgentCode')) {
          if (parseInt(object.get('IsLogin')) === 1) {
            ;(arr[i].AgentCode = object.get('AgentCode')),
              (arr[i].AgentName = object.get('AgentName') + '[' + object.get('Queue') + ']'),
              (arr[i].AgentStatus = object.get('AgentStatus')),
              (arr[i].AgentStatusCode = object.get('AgentStatusCode')),
              (arr[i].AgentTime = Date.parse(object.get('startedAt')))
          } else {
            arr.splice(i, 1)
          }
        }
      }
    } else {
      arr.push({
        AgentCode: object.get('AgentCode'),
        AgentName: object.get('AgentName') + '[' + object.get('Queue') + ']',
        AgentStatus: object.get('AgentStatus'),
        AgentStatusCode: object.get('AgentStatusCode'),
        AgentTime: Date.parse(object.get('startedAt')),
      })
    }

    this.setState({
      OnlineAgentList: arr,
    })
  }

  /*
  updateOnlineAgentList(object) {
    const updatedAgent = {
      AgentCode: object.get("AgentCode"),
      AgentName: object.get("AgentName"),
      AgentStatus: object.get("AgentStatus"),
      AgentTime: Date.parse(object.get("startedAt")),
    };
  
    this.setState((prevState) => ({
      OnlineAgentList: prevState.OnlineAgentList.map((agent) =>
        agent.AgentCode === updatedAgent.AgentCode ? updatedAgent : agent
      ),
    }));
  }

*/

  deleteOnlineAgentList(id) {
    let arr = this.state.OnlineAgentList

    if (this.searchAgent(id) === true) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].AgentCode === id) {
          arr.splice(i, 1)
        }
      }

      this.setState({
        OnlineAgentList: arr,
      })
    }
  }

  onlineTimeStyle(nornal, warning, timeValue) {
    let time_normal = nornal * 60000,
      time_warning = warning * 60000

    if (timeValue < time_normal) {
      return 'text-dark'
    } else if (timeValue < time_warning) {
      return 'text-dark'
    } else {
      return 'text-dark'
    }
  }

  searchAgent(id) {
    let myArray = this.state.OnlineAgentList
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].AgentCode === id) {
        return true
      }
    }
  }

  //-----------------------------------------------

  async get_data() {
    /*
        let hosturl = "https://192.168.56.10:4000/api";
        let wsurl = "wss://192.168.56.10:4000";
        let masterKey = "wallboardapi";
        let clientKey = "wallboardapi";
        let javascriptKey = "wallboardapi";
        let appId = "wallboardapi";
    */
    console.log('hosturl: ' + wbconfig.hosturl)
    console.log('wsurl: ' + wbconfig.wsurl)

    let ip_connect = wbconfig.hosturl
    let ip_ws = wbconfig.wsurl

    Parse.serverURL = ip_connect

    Parse.initialize(
      wbconfig.appId, // Application ID
      wbconfig.javascriptKey, // Javascript key
      wbconfig.masterKey, // Javascript key
    )

    let WallboardBanner = Parse.Object.extend('WallboardBanners')
    let WallboardBanners = new Parse.Query(WallboardBanner)

    let CallAgentSummaries = Parse.Object.extend('CallAgentSummaries')
    let queryCallAgentSummaries = new Parse.Query(CallAgentSummaries)

    let OnlineAgentLists = Parse.Object.extend('OnlineAgentLists')
    let queryOnlineAgentLists = new Parse.Query(OnlineAgentLists)

    Parse.liveQueryServerURL = await ip_ws

    //------------ Class: WallboardBanners ----------------

    const WallBoardText = await WallboardBanners.find()
    let wallboard = await WallboardBanners.subscribe()

    const banner = WallBoardText.map((item) => ({
      Queue: item.get('Queue'),
      BannerText: item.get('BannerText'),
    }))

    /*
    banner:{
        {
          Queue: '1',
          BannerText: 'ทดสอบ1'
        },
        {
          Queue: '2',
          BannerText: 'ทดสอบ2x'
        },
        {
          Queue: '3',
          BannerText: 'ทดสอบ3'
        },
    }
    }
    */

    this.setState({ WallboardBanner: banner })

    wallboard.on('open', () => {
      console.log('subscription opened wallboard')
    })

    wallboard.on('create', async (object) => {
      console.log('object create wallboard')
      const newBanner = {
        BannerText: object.get('BannerText'),
        Queue: object.get('Queue'),
      }

      this.setState((prevState) => {
        const updatedState = [...prevState.WallboardBanner, newBanner]
        return { WallboardBanner: updatedState }
      })
    })

    wallboard.on('update', async (object) => {
      console.log('subscription Update wallboard')

      const updatedBanner = {
        BannerText: object.get('BannerText'),
        Queue: object.get('Queue'),
      }

      this.setState((prevState) => {
        const updatedIndex = prevState.WallboardBanner.findIndex(
          (item) => item.Queue === updatedBanner.Queue,
        )

        if (updatedIndex !== -1) {
          const updatedState = [...prevState.WallboardBanner]
          updatedState[updatedIndex] = updatedBanner
          return { WallboardBanner: updatedState }
        }
        return prevState
      })
    })

    wallboard.on('delete', async (object) => {
      const deletedQueue = object.get('Queue')

      this.setState((prevState) => {
        const updatedState = prevState.WallboardBanner.filter((item) => item.Queue !== deletedQueue)
        return { WallboardBanner: updatedState }
      })
    })

    //------------ Class: CallAgentSummaries ----------------

    // Call Agent Summaries
    const summaryGet = await queryCallAgentSummaries.find()

    if (summaryGet) {
      var CallAgentSummarie = {}

      summaryGet.map((item) => {
        const arr = {
          CallAbandon: parseInt(item.get('CallAbandon')),
          CallOffer: parseInt(item.get('CallOffer')),
        }
        CallAgentSummarie[item.get('Queue')] = arr
      })

      this.setState((prevState) => ({
        CallAgentSummaries: CallAgentSummarie,
      }))
    }

    let summary = await queryCallAgentSummaries.subscribe()

    summary.on('update', async (object) => {
      const arr = {
        CallAbandon: parseInt(object.get('CallAbandon')),
        CallOffer: parseInt(object.get('CallOffer')),
      }

      this.setState((prevState) => ({
        CallAgentSummaries: {
          ...prevState.CallAgentSummaries,
          [object.get('Queue')]: arr,
        },
      }))
    })

    //------------ Class: OnlineAgentLists ----------------

    const onlineAgentList = await queryOnlineAgentLists.find()
    this.getOnlineAgentList(onlineAgentList)
    let agent = await queryOnlineAgentLists.subscribe()

    agent.on('create', async (object) => {
      console.log('object Create agent list')
      this.createOnlineAgentList(object)
    })

    agent.on('update', async (object) => {
      console.log('object updated agent list')
      this.updateOnlineAgentList(object)
    })

    agent.on('delete', async (object) => {
      console.log('object delete agent list')
      this.deleteOnlineAgentList(object.get('AgentCode'))
    })
  } //-- End Function get_data()

  componentDidMount() {
    this.setState({
      status: true,
    })
    this.get_data()
  }

  handleServiceCodeChange(newServiceCode) {
    this.setState({ ServiceCode: newServiceCode })
  }

  render() {
    return (
      <div className="App">
        <Container className="mt-3">
          <WallboardHeader
            title={'AGENT STATUS'}
            serviceChange={this.handleServiceCodeChange}
            ServiceCode={this.state.ServiceCode}
          />
          <CallStatus
            ServiceCode={this.state.ServiceCode}
            CallAgentSummaries={this.state.CallAgentSummaries}
            OnlineAgentList={this.state.OnlineAgentList}
            CallQueueList={this.state.CallQueueList}
          />
          <CenterBar
            ServiceCode={this.state.ServiceCode}
            WallBoardText={this.state.WallboardBanner}
          />
        </Container>
        <Agentonline
          OnlineAgentList={this.state.OnlineAgentList}
          ServiceCode={this.state.ServiceCode}
        />
        <Container className="text-center">
          <ReactAudioPlayer
            src={this.state.beep}
            autoPlay
            muted={!this.state.checked}
            loop={true}
            controls={false}
            download={false}
          />
        </Container>
      </div>
    )
  }
}
