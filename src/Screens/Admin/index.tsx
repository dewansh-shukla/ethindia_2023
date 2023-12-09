import React from "react"
import { useAccount } from "wagmi"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import { InsuranceClaimProcessingAbi } from "../../constants/index.tsx"
import { statuses } from "../../constants/claimStatuses.tsx"

const Admin = () => {
  const { address } = useAccount()
  const [claimAmounts, setClaimAmounts] = React.useState<{
    [claimId: string]: number
  }>({})
  const [claims, setClaims] = React.useState<any>([])
  const navigate = useNavigate()
  React.useEffect(() => {
    if (!address) {
      navigate("/")
    }
  }, [address, navigate])

  const approveClaim = async (claimId: string) => {
    const claimAmount = claimAmounts[claimId]
    if (claimAmount !== undefined) {
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
          await contract.verifyBillHospital(claimId, claimAmount)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

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

  return (
    <div className='flex flex-col min-h-screen items-center'>
      <span className='mt-2'>Admin Claims</span>
      {claims.length > 0 ? (
        <div className='flex flex-col'>
          {claims.map((claim, index) => (
            <div key={"claim_" + index} className='p-2 border-red-100 border-1'>
              <h2>{`Claim #${claim.claimId}`}</h2>
              <p>{`Patient: ${claim.patient}`}</p>
              <p>{`Hospital Admin: ${claim.hospitalAdmin}`}</p>
              <p>{`Claim Amount: ${claim.claimAmount}`}</p>
              <p>{`Is Bill Verified By Hospital: ${claim.isBillVerifiedByHospital}`}</p>
              <a href={`https://ipfs.io/ipfs/${claim.nftId}`} target='_blank'>
                Open Claim Document
              </a>
              <p>{`Status: ${claim.status}`}</p>
              <div className='flex justify-end mt-2'>
                <button
                  className='btn w-1/4 mr-4'
                  onClick={() => approveClaim(claim.claimId)}
                >
                  Approve
                </button>
                <input
                  type='number'
                  placeholder='Type here'
                  className='input input-bordered input-accent w-2/5'
                  onChange={(e) =>
                    setClaimAmounts({
                      ...claimAmounts,
                      [claim.claimId]: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>You Dont have any claim</div>
      )}
    </div>
  )
}

export default Admin
