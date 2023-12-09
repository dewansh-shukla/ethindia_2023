import React from "react"
import { ethers } from "ethers"
import { InsuranceClaimProcessingAbi } from "../../constants/index.tsx"
import { useAccount } from "wagmi"
import { Web3Storage } from "web3.storage"

const Index = () => {
  const { address } = useAccount()
  const [image, setImage] = React.useState<any>(null)
  const [preview, setPreview] = React.useState<any>()
  const [claims, setClaims] = React.useState<any>([])
  const inputRef = React.useRef()

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
            }
            claimsArray.push(claim)
          }

          setClaims(claimsArray)
          console.log(claimsArray)
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
    <div className='min-h-screen flex flex-col w-full items-center'>
      {claims.length > 0 ? (
        <div>
          <h1 className='text-2xl font-bold'>Your Claims</h1>
          <div className='flex flex-col'>
            {claims.map((claim, index) => (
              <div
                key={"claim_" + index}
                className='p-2 border-red-100 border-1'
              >
                <h2>{`Claim #${index + 1}`}</h2>
                <p>{`Patient: ${claim.patient}`}</p>
                <p>{`Hospital Admin: ${claim.hospitalAdmin}`}</p>
                <p>{`Claim Amount: ${claim.claimAmount}`}</p>
                <p>{`Is Bill Verified By Hospital: ${claim.isBillVerifiedByHospital}`}</p>
                <img
                  src={`https://ipfs.io/ipfs/${claim.nftId}`}
                  alt={`NFT Image ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>You Dont have any claim</div>
      )}

      {/* Modal to create a claim */}
      <dialog id='createClaimModal' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>
            Upload document to Verify and Create Claim
          </h3>
          <input
            type='file'
            ref={inputRef}
            className='file-input w-full max-w-xs'
            onChange={handleChange}
          />
          {preview && (
            <>
              <img
                src={preview}
                alt='preview'
                className='mt-2 max-w-xs h-auto'
              />
              <button
                onClick={handleRemoveImage}
                className='mt-2 bg-red-500 text-white p-1 rounded'
              >
                Remove Image
              </button>
            </>
          )}
          {preview && (
            <button className='btn btn-primary mt-2' onClick={submit}>
              Create Claim
            </button>
          )}
        </div>
      </dialog>
    </div>
  )
}

export default Index
