import * as React from 'react'

type Props = {
    contextProviders: JSX.Element[]
    children: JSX.Element
}

export function ContextProviderComposer(props: Props): JSX.Element {
    const { contextProviders, children } = props
    return contextProviders.reduceRight(
        (children, parent) => React.cloneElement(parent, { children }),
        children,
    )
}
