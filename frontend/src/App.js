import './App.css';
import React from 'react';
import {AreaChart, CartesianGrid, Area, XAxis, YAxis} from 'recharts'


class App extends React.Component {
  state = {data: [], count: 0}

  componentDidMount() {
    const ws = new WebSocket('ws://localhost:8000/ws')
    ws.onmessage = this.onMessage

    this.setState({
      ws: ws,
      // Create an interval to send echo messages to the server
      interval: setInterval(() => ws.send('echo'), 1000)
    })
  }

  componetWillUnmount() {
    const {ws, interval} = this.state;
    ws.close()
    clearInterval(interval)
  }

  onMessage = (env) => {
    const recv = JSON.parse(env.data)
    const {data, count} = this.state
    let newData = [...data]
    // Remove first data if we received more than 20 values
    if (count > 20) {
      newData = newData.slice(1)
    }
    var to_push = {value: recv.value, index: count}
    console.log(to_push)
    newData.push(to_push)
    this.setState({data: newData, count: count + 1})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>
            WebSocket Example: real-time chart
          </h2>
          <AreaChart width={900} height={600} data={this.state.data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#33ff33" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#33ff33" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="index" />
            <YAxis />
            <CartesianGrid stroke="#756" strokeDasharray="5 5" />
            <Area type="monotone" dataKey="value" stroke="#33ff33" fill="url(#colorValue)" isAnimationActive={false}/>
          </AreaChart>
        </header>
      </div>
    )
  }
}

export default App;

