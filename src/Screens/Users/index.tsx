import React from "react"
import { ethers } from "ethers"
import { InsuranceClaimProcessingAbi } from "../../constants/index.tsx"
import { useAccount } from "wagmi"
import { Web3Storage } from "web3.storage"

const Index = () => {
  const { address } = useAccount()
  const [image, setImage] = React.useState<any>(null)
  const [preview, setPreview] = React.useState<any>()
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
          console.log(claims)
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
  const uploadToIpfs = async () => {
    try {
      const Web3StorageClient = new Web3Storage({
        token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
      })
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
        const ipfsCid = await uploadToIpfs()
        console.log(ipfsCid)
        // const provider = new ethers.BrowserProvider(ethereum)
        // const signer = await provider.getSigner()
        // const contract = new ethers.Contract(
        //   import.meta.env.VITE_CLAIMS_PROCESSING_CONTRACT_ADDRESS,
        //   InsuranceClaimProcessingAbi,
        //   signer
        // )
        // const transaction = await contract.createClaim()
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='min-h-screen flex flex-col'>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <div>Previous Claims Listed here</div>

      <dialog id='my_modal_1' className='modal'>
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
