import * as React from 'react'
import { useParams } from 'react-router-dom'

function League(): JSX.Element {
    const { id } = useParams()
    if (!id) {
        return <>No id provided</>
    }
    return <>League with id '{id}'</>
}

export { League }
