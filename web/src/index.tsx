import './i18n/config'

import 'bootstrap/dist/css/bootstrap.min.css'

import './styles/reactist.css'
import './styles/index.css'

import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import { ContextProviderComposer } from './components/context-provider-composer'
import { store } from './reducers/store'
import { App } from './app'
import { GeneralErrorBoundary } from './components'
import { ApiClientProvider, AuthProvider, UserProvider } from './hooks'

const providerTypes = [AuthProvider, ApiClientProvider, UserProvider]
const providers = providerTypes.map((Provider, i) => <Provider key={i} />)

ReactDOM.render(
    <React.StrictMode>
        <GeneralErrorBoundary>
            <Provider store={store}>
                <ContextProviderComposer contextProviders={providers}>
                    <Router>
                        <App />
                    </Router>
                </ContextProviderComposer>
            </Provider>
        </GeneralErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
