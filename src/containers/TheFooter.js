import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        Mert Can
        <span className="ml-1">&copy; 2021 Exchange.</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        Crypto Currency
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
