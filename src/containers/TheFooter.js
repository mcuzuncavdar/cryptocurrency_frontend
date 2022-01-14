import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        Mert Can
        <span className="ml-1">&copy; 2021 CryptoCurrencyApp.</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        CryptoCurrencyApp
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
