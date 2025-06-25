"use client"

import { useState, useEffect } from "react"

// Interfaces based on the API response structure
interface TokenOmniApyData {
  apy: {
    vAPY: string
    totalAPY: string
    coefficient: string
    apyReward: string
    singleTokenAPY: string
    lpTokenAPY: string
  }
  // Add other fields from /api/omni/{TOKEN} if needed
}

interface StakingAsset {
  contractAddress: string
  symbol: string
  slug: string
  baseSlug: string
  unstakingTime: number
  users: number
  apr: number // This seems to be the base APY or part of it
  fee: number
  price: number
  exchangeRatio: number
  supply: number
}

interface StakingApiResponse {
  name: string
  supportedAssets: StakingAsset[]
}

// Detailed APY structure for the dialog
export interface ApyDetails {
  baseApy: {
    ninetyDay: string
    thirtyDay: string
    sevenDay: string
    networkAvg: string
  }
  incentives: {
    singleTokenFarming: string
    lpFarming: string
    expectedTotalApy: string
    bonusMultiplier: string
  }
}

// Interface for the processed data returned by the hook
export interface ProcessedTokenData {
  symbol: string
  price: number
  supply: number
  apy: string // This will be the main displayed APY (e.g., totalAPY or APR)
  apyDetails: ApyDetails
}

export function useTokenData() {
  const [data, setData] = useState<ProcessedTokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokenData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [dotResponse, ethResponse, stakingResponse] = await Promise.all([
          fetch("https://dapi.bifrost.io/api/omni/DOT"),
          fetch("https://dapi.bifrost.io/api/omni/ETH"),
          fetch("https://dapi.bifrost.io/api/staking"),
        ])

        if (!dotResponse.ok || !ethResponse.ok || !stakingResponse.ok) {
          const errorMessages = []
          if (!dotResponse.ok) errorMessages.push(`DOT API failed: ${dotResponse.status}`)
          if (!ethResponse.ok) errorMessages.push(`ETH API failed: ${ethResponse.status}`)
          if (!stakingResponse.ok) errorMessages.push(`Staking API failed: ${stakingResponse.status}`)
          throw new Error(`Failed to fetch token data. ${errorMessages.join(", ")}`)
        }

        const dotOmniData: TokenOmniApyData = await dotResponse.json()
        const ethOmniData: TokenOmniApyData = await ethResponse.json()
        const stakingData: StakingApiResponse = await stakingResponse.json()

        const getOmniDataForSymbol = (symbol: string): TokenOmniApyData | null => {
          if (symbol === "vDOT") return dotOmniData
          if (symbol === "vETH") return ethOmniData
          return null
        }

        const tokenList = stakingData.supportedAssets
          .filter((asset) => ["vDOT", "vETH"].includes(asset.symbol))
          .map((tokenAsset) => {
            const omniData = getOmniDataForSymbol(tokenAsset.symbol)
            const mainApy = omniData?.apy?.totalAPY || tokenAsset.apr.toFixed(2)

            // Mock data for fields not directly available from these APIs
            // In a real scenario, these would come from the API or be calculated
            const apyDetails: ApyDetails = {
              baseApy: {
                ninetyDay: (Number.parseFloat(mainApy) * 0.95).toFixed(2), // Mocked
                thirtyDay: (Number.parseFloat(mainApy) * 0.98).toFixed(2), // Mocked
                sevenDay: (Number.parseFloat(mainApy) * 1.01).toFixed(2), // Mocked
                networkAvg: (Number.parseFloat(mainApy) * 1.05).toFixed(2), // Mocked
              },
              incentives: {
                singleTokenFarming: omniData?.apy?.singleTokenAPY || "0.00",
                lpFarming: omniData?.apy?.lpTokenAPY || "-", // API might return empty or specific format
                expectedTotalApy: omniData?.apy?.totalAPY || mainApy,
                bonusMultiplier: omniData?.apy?.coefficient || "1.00", // Assuming coefficient is bonus multiplier
              },
            }

            return {
              symbol: tokenAsset.symbol,
              price: tokenAsset.price,
              supply: tokenAsset.supply,
              apy: mainApy,
              apyDetails: apyDetails,
            }
          })
          .sort((a, b) => Number.parseFloat(b.apy) - Number.parseFloat(a.apy))

        setData(tokenList)
      } catch (err) {
        console.error("Error fetching token data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchTokenData()
  }, [])

  return { data, loading, error }
}
