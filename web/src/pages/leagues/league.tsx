import * as React from 'react'
import { Text } from '@doist/reactist'
import { useParams } from 'react-router-dom'

function League(): JSX.Element {
    const { id } = useParams()
    if (!id) {
        return <>No id provided</>
    }
    return (
        <Text>
            League with id <strong>{id}</strong>
        </Text>
    )
}

export { League }
