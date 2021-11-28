import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './app'
import { ContextProviderComposer } from './components/context-provider-composer'
import { AuthProvider } from './hooks'

const providerTypes = [AuthProvider]
const providers = providerTypes.map((Provider, i) => <Provider key={i} />)

ReactDOM.render(
    <React.StrictMode>
        <ContextProviderComposer contextProviders={providers}>
            <App />
        </ContextProviderComposer>
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
