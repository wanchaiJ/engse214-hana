import React from 'react'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: 90%;
  margin: auto;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: 5px 0;

  .wallboard_logo {
    width: 200px;

    img {
      width: 100%;
    }
  }

  .wallboard_title {
    flex: 1;
    font-size: 3rem;
    padding-left: 30px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
  }
  .datetimes {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 97px;
    .dateTime {
      text-transform: uppercase;
      font-size: 2.6rem;
      padding-bottom: 10px;
      color: blue;
      font-weight: bold;
    }
  }
  .wallboard_queue {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .queue_title {
      font-size: 2rem;
      text-transform: uppercase;
      color: #3498db;
      font-weight: bold;
    }

    select {
      width: 100%;
    }
  }
`

export const CallStatusContainer = styled.div`
  display: flex;
  justify-content: space-between;

  .group {
    padding: 30px;
    width: 350px;
    justify-content: center;
    align-items: center;

    .label {
      font-size: 2rem;
      text-align: center;
      color: #fff;
    }

    .counter {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;

      .icon {
        color: #fff;

        svg {
          font-size: 3rem;
        }
      }

      .statis {
        font-size: 3rem;
        font-weight: bold;
        color: #fff;
      }
    }

    &.offerCall {
      background: #28a745;
    }

    &.abandon_call {
      background: rgb(248, 215, 218);

      .label {
        color: rgb(114, 28, 36);
      }
      .counter {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;

        .icon {
          color: rgb(114, 28, 36);

          svg {
            font-size: 3rem;
          }
        }

        .statis {
          font-size: 3rem;
          font-weight: bold;
          color: rgb(114, 28, 36);
        }
      }
    }

    &.logged_agent {
      background: #17a2b8 !important;
    }

    &.total_call_queue {
      background: #ffffff;
      border: 2px solid red;

      .label {
        color: rgb(24, 24, 24);
      }

      .counter {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;

        .statis {
          font-size: 3rem;
          font-weight: bold;
          color: rgb(0, 0, 0);
        }
      }
    }
  }
`

export const CenterBarStyle = styled.div`
  background-color: #e5e5e5;
  padding: 20px;
  display: flex;
  margin-top: 30px;
  margin-bottom: 30px;

  .left {
    flex: 1;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;

    .TextSlide {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      overflow: hidden;
      padding-left: 0;

      .MarqueeText {
        * {
          font-size: 2rem !important;
          color: #e74c3c;
          padding: 4px 0px;
        }
      }
    }
  }

  .right {
    .right-title {
      text-transform: uppercase;
      font-size: 2rem;
      padding-bottom: 10px;
    }

    .Queue {
      width: 100%;
      height: 150px;
      background-color: #fff;
      border: #c5c5c5 1px solid;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 7rem;
    }
  }
`

export const Wallboard1Container = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  flex-direction: column;
  margin-top: 20px;

  .line {
    display: flex;
    justify-content: space-between;
    background: #d6d6d6;

    .group {
      flex: 1;
      border: 1px solid #000000;

      .value {
        padding: 25px;
        font-size: 5rem;
        font-weight: bold;
        text-align: center;
      }

      .label {
        background-color: #0844a4;
        color: #ffffff;
        font-size: 2rem;
        text-align: center;
        font-weight: bold;

        &.text-red {
          color: #e61610;
        }
      }
    }

    &.line2 {
      background: #c9f1fd;
      .group {
        .label {
          background-color: #75a9f9;
        }
      }
    }

    &.line3 {
      background: #cbe8ba;
      .group {
        .label {
          background-color: #72bb53;
        }
      }
    }

    &.line4 {
      background: #fff1d7;
      .group {
        .label {
          background-color: #fec63d;
        }
      }
    }
  }
`
