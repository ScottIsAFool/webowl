import React from 'react'

import { Box } from '@doist/reactist'

type State = {
    displayError: boolean
}

class GeneralErrorBoundary extends React.Component<unknown, State> {
    state = { displayError: false }

    // TODO: Send error info to sentry https://github.com/Doist/todoist-importer/issues/19
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidCatch(error: unknown, errorInfo: unknown): void {
        // eslint-disable-next-line no-console
        console.log(error)
        this.setState({ displayError: true })
    }

    render(): React.ReactNode {
        const { displayError } = this.state
        const { children } = this.props

        return displayError ? <Box>Error</Box> : children
    }
}

export { GeneralErrorBoundary }
