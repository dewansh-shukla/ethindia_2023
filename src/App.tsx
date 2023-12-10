import mountainImage from "./mountains.jpg";
import { ConnectKitButton } from "connectkit"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { useNavigate } from "react-router-dom"
import React from "react"

  const App = () => {
    const { address } = useAccount()
    const navigate = useNavigate()
    const backgroundImageStyle = {
      backgroundImage: `url("${mountainImage}")`,
      backgroundSize: "cover",
    }
    React.useEffect(() => {
      if (address) {
      }
    }, [address, navigate])
  return (
    <div className="App">
      <div className=" text-white " style={backgroundImageStyle}>
        <div className="bg-gradient-to-r from-black px-14 py-8">
          <div className=" max-w-3xl grid grid-cols-1 gap-8">
            <h2 className="text-xl uppercase font-bold">Insurify</h2>
            <ConnectKitButton />
            <h1 className="text-6xl font-bold">
              Your Gateway to Easy Insurance Claims
            </h1>
            <p className="text-lg">
              
            Welcome to our decentralized application (DApp) for Insurance Claim Processing. Built on the Ethereum blockchain, our DApp leverages the power of smart contracts to streamline the claims process, ensuring transparency and efficiency. 
             While the goal of medical insurance is to provide financial support during times of illness or injury, the complexity of the healthcare system, 
            coupled with evolving regulations and administrative challenges, can make the medical insurance claim process difficult in today's time, which our application aims to rectify.
            </p>
            
            <button className="bg-gradient-to-r from-pink-600 to-orange-600 py-3 px-6 text-lg rounded-md w-48">
              See Dashboard
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 py-16">
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
        </div>
        </div>
      <div className="px-8 py-16">
        <div className="max-w-md mb-16">
          <h2 className="text-5xl">
            Your next insurance claim made easier through Insurify.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-slate-600">
          <div>
            <h3 className="text-2xl font-bold mb-2">Customer Satisfaction</h3>
            <p className="text-lg">
            The application aims to simplify procedures that can reduce the stress and hassle associated with filing a claim, making the overall experience more positive for policyholders.

            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-2">Competitive Advantage</h3>
            <p className="text-lg">
            A simple and efficient claims process can be a competitive differentiator for insurance companies in a crowded market. It can attract new customers and retain existing ones.            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Risk Management</h3>
            <p className="text-lg">
            Quick settlements help policyholders recover from a loss or damage more promptly, reducing the financial impact and improving the overall risk management process.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-2">Technology Integration</h3>
            <p className="text-lg">
            Leveraging technology for claims processing can lead to automation, reducing errors and speeding up the overall claims settlement process.                    </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
