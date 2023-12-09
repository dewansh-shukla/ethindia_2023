import React from "react"
import { ethers } from "ethers"
import { InsuranceClaimProcessingAbi } from "../../constants/index.tsx"
import { useAccount } from "wagmi"
import { Web3Storage } from "web3.storage"
import { useNavigate } from "react-router-dom"
import { statuses } from "../../constants/claimStatuses.tsx"
import { motion } from "framer-motion"
import { FaCopy } from "react-icons/fa"

const Index = () => {
  const { address } = useAccount()
  const navigate = useNavigate()
  const [image, setImage] = React.useState<any>(null)
  const [preview, setPreview] = React.useState<any>()
  const [claims, setClaims] = React.useState<any>([])
  const inputRef = React.useRef()
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
          const claims = await contract.getPatientClaims(address)
          const claimsArray = []
          for (let i = 0; i < claims.patients.length; i++) {
            // Create a claim object for each claim
            let claim = {
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

  const handleChange = (e) => {
    const file = e.target.files[0]
    setImage(file) // Update the state

    // create a preview URL
    setPreview(URL.createObjectURL(file))
  }
  const handleRemoveImage = () => {
    inputRef.current.value = ""
    setImage(null)
    setPreview(null)
  }
  const getWeb3Client = () => {
    return new Web3Storage({
      token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
    })
  }

  const uploadToIpfs = async () => {
    try {
      const Web3StorageClient = getWeb3Client()
      const cid = await Web3StorageClient.put([image])
      return cid
    } catch (error) {
      console.log(error)
    }
  }
  const submit = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const Cid = await uploadToIpfs()
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(
          import.meta.env.VITE_CLAIMS_PROCESSING_CONTRACT_ADDRESS,
          InsuranceClaimProcessingAbi,
          signer
        )
        const transaction = await contract.submitBill(
          "0x1cdb53eb11290e26f4234cacf984b0142c63ba21", // Hospital Admin Address Keeping it static for now
          Cid
        )
        document.getElementById("createClaimModal").close()
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='min-h-screen flex flex-col w-full items-center bg-gray-black text-white'>
      <h1 className='mb-6 mt-6 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-4xl dark:text-white'>
        Your Claims
      </h1>
      {claims.length > 0 ? (
        <div className='max-w-md w-full p-5 rounded-md shadow-md mt-2'>
          <div className='flex flex-col gap-4'>
            {claims.map((claim, index) => (
              <motion.div
                key={"claim_" + index}
                className='p-4 border border-gray-700 rounded-md m-2'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{ boxShadow: "0 0 10px 1px purple" }}
              >
                <h2 className='font-bold text-lg text-cyan-300'>{`Claim #${
                  index + 1
                }`}</h2>
                <ul className='list-disc list-inside space-y-1 mt-2 text-gray-300'>
                  <motion.div
                    className='lg:tooltip'
                    data-tip={claim.patient}
                    onClick={() => navigator.clipboard.writeText(claim.patient)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <li>
                      {`Hospital Admin: ${claim.patient.slice(
                        0,
                        3
                      )}...${claim.patient.slice(-3)}`}
                    </li>
                  </motion.div>
                  <motion.div
                    className='lg:tooltip'
                    data-tip={claim.hospitalAdmin}
                    onClick={() =>
                      navigator.clipboard.writeText(claim.hospitalAdmin)
                    }
                    whileTap={{ scale: 0.9 }}
                  >
                    <li>
                      {`Hospital Admin: ${claim.hospitalAdmin.slice(
                        0,
                        3
                      )}...${claim.hospitalAdmin.slice(-3)}`}
                    </li>
                  </motion.div>
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
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className='bg-red-800 border border-red-300 text-red-300 p-4 w-full max-w-md mt-4 rounded-md shadow-md'
          role='alert'
        >
          <p className='font-bold'>No Claims</p>
          <p>You don't have any claim</p>
        </div>
      )}

      {/* Modal to create a claim */}
      <dialog
        id='createClaimModal'
        className='modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50'
      >
        <div className='modal-box bg-gray-800 text-white shadow-xl rounded-lg mx-2 md:max-w-md mx-auto'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg px-4 py-2'>
            Upload document to Verify and Create Claim
          </h3>
          <div className='p-4'>
            <input
              type='file'
              ref={inputRef}
              className='file-input w-full my-2 p-2 border border-gray-600 rounded-md'
              onChange={handleChange}
            />
            {preview && (
              <>
                <img
                  src={preview}
                  alt='preview'
                  className='mt-2 w-full h-auto object-cover rounded-md'
                />
              </>
            )}
          </div>
          <div className='p-4 flex justify-end'>
            {preview && (
              <div className='flex items-center jsus'>
                <button
                  onClick={handleRemoveImage}
                  className='btn btn-primary bg-red-500 py-2 px-4 text-white p-1 rounded mr-2'
                >
                  Change Image
                </button>
                <button
                  className='btn btn-primary py-2 px-4  rounded bg-blue-500 text-white '
                  onClick={submit}
                >
                  Create Claim
                </button>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Index
