import * as React from 'react'

import { Button, ButtonProps, Hidden } from '@doist/reactist'

type Props = Pick<Required<ButtonProps>, 'variant' | 'children' | 'icon' | 'onClick' | 'tooltip'> &
    Pick<ButtonProps, 'type' | 'exceptionallySetClassName'>

function IconButton({ icon, children, ...rest }: Props): JSX.Element {
    return (
        <>
            <Hidden above="mobile">
                <Button icon={icon} aria-label={rest.tooltip as string} {...rest} />
            </Hidden>
            <Hidden below="tablet">
                <Button startIcon={icon} aria-label={rest.tooltip as string} {...rest}>
                    {children}
                </Button>
            </Hidden>
        </>
    )
}

export { IconButton }
