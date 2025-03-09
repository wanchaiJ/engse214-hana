import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Parse } from 'parse'
import { Row, Col } from 'react-bootstrap'
import { BsFillPersonFill } from 'react-icons/bs'
import { Container } from './style'
import { msToTime, msToTimeFor4 } from './NotReadyAgent'
import { useState } from 'react'
import { useEffect } from 'react'

const wbenv = process.env.NODE_ENV

const Agentonline = ({ OnlineAgentList, ServiceCode }) => {
  return (
    <div>
      <Container className="mt-3">
        <Row>
          <Col md={3}>
            <table className="table table-sm border shadow-sm bg-light">
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    className="bg-success text-light text-center"
                    style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                  >
                    Available Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {ServiceCode === 'ALL'
                  ? Object.keys(OnlineAgentList).map((key) => {
                      const agent = OnlineAgentList[key]
                      if (parseInt(agent.AgentStatus) === 1) {
                        return msToTime(
                          agent.AgentTime,
                          'false',
                          agent.AgentName,
                          '',
                          agent.AgentCode,
                        )
                      }
                    })
                  : Object.keys(OnlineAgentList).map((key) => {
                      const agent = OnlineAgentList[key]
                      if (parseInt(agent.AgentStatus) === 1 && agent.Queue === ServiceCode) {
                        return msToTime(
                          agent.AgentTime,
                          'false',
                          agent.AgentName,
                          '',
                          agent.AgentCode,
                        )
                      }
                    })}
              </tbody>
            </table>
          </Col>
          <Col md={3}>
            <table className="table table-sm border shadow-sm bg-light">
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    className="bg-info text-light text-center"
                    style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                  >
                    Active Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {ServiceCode === 'ALL'
                  ? Object.keys(OnlineAgentList).map((key) => {
                      const agent = OnlineAgentList[key]
                      if (parseInt(agent.AgentStatus) === 2) {
                        return msToTime(
                          agent.AgentTime,
                          'false',
                          agent.AgentName,
                          '',
                          agent.AgentCode,
                        )
                      }
                    })
                  : Object.keys(OnlineAgentList).map((key) => {
                      const agent = OnlineAgentList[key]
                      if (parseInt(agent.AgentStatus) === 2 && agent.Queue === ServiceCode) {
                        return msToTime(
                          agent.AgentTime,
                          'false',
                          agent.AgentName,
                          '',
                          agent.AgentCode,
                        )
                      }
                    })}
              </tbody>
            </table>
          </Col>
          <Col md={3}>
            <table className="table table-sm border shadow-sm bg-light">
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    className="bg-warning text-center"
                    style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                  >
                    Wrap Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {ServiceCode === 'ALL'
                  ? Object.keys(OnlineAgentList).map((key) => {
                      const agent = OnlineAgentList[key]
                      if (parseInt(agent.AgentStatus) === 3) {
                        return msToTime(
                          agent.AgentTime,
                          'false',
                          agent.AgentName,
                          '',
                          agent.AgentCode,
                        )
                      }
                    })
                  : Object.keys(OnlineAgentList).map((key) => {
                      const agent = OnlineAgentList[key]
                      if (parseInt(agent.AgentStatus) === 3 && agent.Queue === ServiceCode) {
                        return msToTime(
                          agent.AgentTime,
                          'false',
                          agent.AgentName,
                          '',
                          agent.AgentCode,
                        )
                      }
                    })}
              </tbody>
            </table>
          </Col>
          <Col md={3}>
            <table className="table table-sm border shadow-sm bg-light">
              <thead>
                <tr>
                  <th
                    colSpan="2"
                    className="bg-danger text-light text-center"
                    style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                  >
                    Not Ready Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {ServiceCode === 'ALL'
                  ? Object.keys(OnlineAgentList).map((key) => {
                      const agent = OnlineAgentList[key]

                      //console.log("agent.AgentTime: "+agent.AgentTime);
                      //console.log("agent.AgentName: "+agent.AgentName);
                      //console.log("agent.AgentCode: "+agent.AgentCode);
                      //console.log("agent.AgentStatusCode: "+agent.AgentStatusCode);

                      if (parseInt(agent.AgentStatus) === 4) {
                        //return msToTimeFor4(agent.AgentTime, 'false', agent.AgentName, '', agent.AgentCode, agent.AgentStatusCode)
                        return msToTimeFor4(
                          agent.AgentTime,
                          'false',
                          agent.AgentName,
                          '',
                          agent.AgentCode,
                          parseInt(agent.AgentStatusCode),
                        )
                      }
                    })
                  : Object.keys(OnlineAgentList).map((key) => {
                      const agent = OnlineAgentList[key]
                      if (
                        parseInt(agent.AgentStatus) === 4 &&
                        agent.Queue &&
                        agent.Queue === ServiceCode
                      ) {
                        return msToTimeFor4(
                          agent.AgentTime,
                          'false',
                          agent.AgentName,
                          '',
                          agent.AgentCode,
                          agent.AgentStatusCode,
                        )
                      }
                    })}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Agentonline
