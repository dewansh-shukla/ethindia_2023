import React from "react"
import { useAccount } from "wagmi"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import { InsuranceClaimProcessingAbi } from "../../constants/index.tsx"
import { statuses } from "../../constants/claimStatuses.tsx"
import { motion } from "framer-motion"
const Insurer = () => {
  const { address } = useAccount()
  const [claims, setClaims] = React.useState<any>([])
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!address) {
      navigate("/")
    }
  }, [address, navigate])
  React.useEffect(() => {
    const fetchUsersClaims = async () => {
      try {
        const { ethereum } = window
        if (ethereum) {
          const provider = new ethers.BrowserProvider(ethereum)
          const signer = await provider.getSigner()
          const contract = new ethers.Contract(
            import.meta.env.VITE_CLAIMS_PROCESSING_CONTRACT_ADDRESS,
            InsuranceClaimProcessingAbi,
            signer
          )
          const claims = await contract.getAllClaims()
          const claimsArray = []
          for (let i = 0; i < claims.patients.length; i++) {
            // Create a claim object for each claim
            let claim = {
              claimId: claims.claimIds[i],
              patient: claims.patients[i],
              hospitalAdmin: claims.hospitalAdmins[i],
              claimAmount: claims.claimAmounts[i],
              isBillVerifiedByHospital: claims.billVerifications[i],
              nftId: claims.nftIds[i],
              status: statuses[claims.claimStatuses[i]],
            }
            claimsArray.push(claim)
          }
          setClaims(claimsArray)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchUsersClaims()
  }, [])
  const processClaim = async (claimId: string) => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(
          import.meta.env.VITE_CLAIMS_PROCESSING_CONTRACT_ADDRESS,
          InsuranceClaimProcessingAbi,
          signer
        )
        await contract.processClaim(claimId)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const [amount, setAmount] = React.useState(0.02)
  const addFunds = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(
          import.meta.env.VITE_CLAIMS_PROCESSING_CONTRACT_ADDRESS,
          InsuranceClaimProcessingAbi,
          signer
        )
        const transaction = await contract.depositFunds({
          value: ethers.utils.parseEther(amount.toString()),
        })
        document.getElementById("my_modal_7").close()
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='flex flex-col min-h-screen items-center'>
      <span className='mt-2'>Insurer Claims</span>
      {claims.length > 0 ? (
        <div className='max-w-md w-full p-5 rounded-md shadow-md mt-2'>
          <div className='flex flex-col gap-4'>
            {claims.map((claim, index) => (
              <motion.div
                key={"claim_" + index}
                className='p-4 border border-red-100 rounded-md m-2 flex flex-col'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{ boxShadow: "0 0 10px 1px purple" }}
              >
                <h2 className='font-bold text-lg text-cyan-300'>{`Claim #${claim.claimId}`}</h2>
                <ul className='list-disc list-inside space-y-1 mt-2 text-gray-300'>
                  <li>
                    <motion.div
                      className='lg:tooltip'
                      data-tip={claim.patient}
                      onClick={() =>
                        navigator.clipboard.writeText(claim.patient)
                      }
                      whileTap={{ scale: 0.9 }}
                    >
                      {`Patient: ${claim.patient.slice(
                        0,
                        3
                      )}...${claim.patient.slice(-3)}`}
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      className='lg:tooltip'
                      data-tip={claim.hospitalAdmin}
                      onClick={() =>
                        navigator.clipboard.writeText(claim.hospitalAdmin)
                      }
                      whileTap={{ scale: 0.9 }}
                    >
                      {`Hospital Admin: ${claim.hospitalAdmin.slice(
                        0,
                        3
                      )}...${claim.hospitalAdmin.slice(-3)}`}
                    </motion.div>
                  </li>
                  <li>{`Claim Amount: ${claim.claimAmount}`}</li>
                  <li>{`Is Bill Verified By Hospital: ${claim.isBillVerifiedByHospital}`}</li>
                  <li>
                    <a
                      href={`https://ipfs.io/ipfs/${claim.nftId}`}
                      target='_blank'
                      className='text-blue-200 underline'
                    >
                      Open Claim Document
                    </a>
                  </li>
                  <li>{`Status: ${claim.status}`}</li>
                </ul>
                <div className='flex justify-end'>
                  <button
                    className='btn w-1/4 mr-4 text-white border-1 border-purple-500'
                    onClick={() => processClaim(claim.claimId)}
                  >
                    Process Claim
                  </button>
                </div>
              </motion.div>
            ))}
            <input type='checkbox' id='my_modal_7' className='modal-toggle' />
            <div className='modal' role='dialog'>
              <div className='modal-box flex flex-col'>
                <h3 className='text-lg font-bold'>
                  Enter the amount to deposit
                </h3>
                <div className='flex w-full justify-around mt-4'>
                  <input
                    type='number'
                    placeholder='Enter the amount'
                    className='input input-bordered input-secondary w-1/2'
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value))
                    }}
                  />
                  <button
                    className='btn w-1/3'
                    onClick={() => {
                      addFunds()
                    }}
                  >
                    Add Funds
                  </button>
                </div>
              </div>
              <label className='modal-backdrop' htmlFor='my_modal_7'>
                Submit
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div>You Dont have any claim</div>
      )}
    </div>
  )
}

export default Insurer
