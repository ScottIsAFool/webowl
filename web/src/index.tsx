import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/reactist.css'
import './styles/index.css'

import * as React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app'
import { BrowserRouter as Router } from 'react-router-dom'
import { ContextProviderComposer } from './components/context-provider-composer'
import { AuthProvider } from './hooks'

const providerTypes = [AuthProvider]
const providers = providerTypes.map((Provider, i) => <Provider key={i} />)

ReactDOM.render(
    <React.StrictMode>
        <ContextProviderComposer contextProviders={providers}>
            <Router>
                <App />
            </Router>
        </ContextProviderComposer>
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
