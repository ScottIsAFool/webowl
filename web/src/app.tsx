import * as React from 'react'
import logo from './logo.svg'
import './app.module.css'
import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { AppRoutes, AuthRoutes, LeagueRoutes } from './routing/routes'

function App(): JSX.Element {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>

                <body>
                    <Routes>
                        <AuthRoutes />
                        <LeagueRoutes />
                        <AppRoutes />
                    </Routes>
                </body>
            </div>
        </Router>
    )
}

export { App }
