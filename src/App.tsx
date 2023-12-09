import { ConnectKitButton } from "connectkit"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { useNavigate } from "react-router-dom"
import React from "react"
const App = () => {
  const { address } = useAccount()
  const navigate = useNavigate()
  React.useEffect(() => {
    if (address) {
    }
  }, [address, navigate])
  return (
    <div className='min-h-screen bg-black text-white p-10'>
      <h1 className='mb-6 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
        Insurify
      </h1>
      <p className='text-lg  text-center mb-12'>
        Welcome to our decentralized application (DApp) for Insurance Claim
        Processing. Built on the Ethereum blockchain, our DApp leverages the
        power of smart contracts to streamline the claims process, ensuring
        transparency and efficiency.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <motion.div
          className='bg-white text-black p-3 rounded border-2 border-purple-500'
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <h3 className='text-xl font-bold mb-2'>Claim Submission</h3>
          <p className='text-base'>
            Patients can submit their medical bills directly to the blockchain.
            Each submission generates a unique claim ID and records details such
            as the patient's address, hospital admin's address, and the NFT ID
            associated with the claim.
          </p>
        </motion.div>

        <div className='bg-white text-black p-3 rounded  border-2 border-purple-500'>
          <motion.div
            className='bg-white text-black p-3 rounded'
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className='text-xl font-bold mb-2'>Bill Verification</h3>
            <p className='text-base'>
              Hospital administrators can verify the submitted bills. Upon
              verification, the claim amount is set, marking the bill as
              verified.
            </p>
          </motion.div>
        </div>

        <div className='bg-white text-black p-3 rounded border-2 border-purple-500'>
          <motion.div
            className='bg-white text-black p-3 rounded '
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3 className='text-xl font-bold mb-2'>Claim Processing</h3>
            <p className='text-base'>
              Once the bill is verified by the hospital, the insurance company
              can process the claim. The claim amount is transferred directly to
              the patient's Ethereum address.
            </p>
          </motion.div>
        </div>

        {/* Add other features here */}
      </div>
      <div className='mt-16'>
        <ul className='timeline timeline-vertical'>
          <li>
            <div className='timeline-start timeline-box bg-black text-white border-1 border-purple-400'>
              Enhanced Transparency
            </div>
            <hr className='bg-white m-2' />
          </li>
          <li>
            <hr className='bg-white m-2' />
            <div className='timeline-end timeline-box bg-black text-white border-1 border-purple-400'>
              Improved Efficiency
            </div>
            <hr className='bg-white m-2' />
          </li>
          <li>
            <hr className='bg-white m-2' />
            <div className='timeline-start timeline-box bg-black text-white border-1 border-purple-400'>
              Reduced Fraud
            </div>
            <hr className='bg-white m-2' />
          </li>
          <li>
            <hr className='bg-white m-2' />
            <div className='timeline-end timeline-box bg-black text-white border-1 border-purple-400'>
              Lower Costs
            </div>
            <hr className='bg-white m-2' />
          </li>
        </ul>
      </div>
      <div className='w-full flex justify-center mt-20'>
        <ConnectKitButton theme='auto' mode='dark' />
      </div>
    </div>
  )
}

export default App
