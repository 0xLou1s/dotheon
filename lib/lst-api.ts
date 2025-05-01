// Define types for the API responses
export interface PoolData {
    chain: string
    project: string
    symbol: string
    tvlUsd: number
    apyBase: number
    apyReward: number | null
    apy: number
    rewardTokens: string[] | null
    pool: string
    apyPct1D: number
    apyPct7D: number
    apyPct30D: number
    stablecoin: boolean
    ilRisk: string
    exposure: string
    predictions?: {
      predictedClass: string
      predictedProbability: number
      binnedConfidence: number
    }
    poolMeta: string | null
    underlyingTokens: string[] | null
    apyMean30d?: number
  }
  
  export interface HistoricalDataPoint {
    timestamp: string
    tvlUsd: number
    apy: number
    apyBase: number
    apyReward: number | null
    il7d: number | null
    apyBase7d: number | null
  }
  
  export interface HistoricalData {
    status: string
    data: HistoricalDataPoint[]
  }
  
  export interface Protocol {
    name: string
    tvl: number
    apy: number // Weighted average APY
    change_24h: number // Weighted average 24h change
    change_7d: number // Weighted average 7d change
    pools: PoolWithHistory[]
  }
  
  export interface PoolWithHistory {
    name: string
    chain: string
    symbol: string
    tvl: number
    apy: number
    change_24h: number
    change_7d: number
    history: HistoricalDataPoint[]
    pool: string
    poolMeta: string | null
  }
  
  // List of LST projects we want to filter for
  const LST_PROJECTS = [
    "zlot",
    "ankr",
    "lido",
    "stakehound",
    "stakewise-v2",
    "stafi",
    "sharedstake",
    "steakbank-finance",
    "marinade-liquid-staking",
    "karura-liquid-staking",
    "meta-pool-near",
    "rocket-pool",
    "geth",
    "asol",
    "stader",
    "ifpool",
    "jpool",
    "neoburger",
    "pstake-lsd",
    "benqi-staked-avax",
    "klaystation",
    "galgo-liquid-governance",
    "sicx",
    "steak",
    "thunderpokt",
    "stakeeasy",
    "linear-protocol",
    "bifrost-liquid-staking",
    "tenderize-v1",
    "argo-finance",
    "acala-liquid-staking",
    "eris-protocol",
    "acala-lcdot",
    "filet-finance",
    "algem",
    "skcs",
    "parallel-polkadot-crowdloan",
    "parallel-polkadot-liquid-staking",
    "exinpool",
    "stcelo",
    "eversol",
    "interlay-staking",
    "frax-ether",
    "stake-ly",
    "geode",
    "amulet-liquidity-staking",
    "ditto",
    "tortuga",
    "increment-liquid-staking",
    "stlos-liquid-staking",
    "yield-yak-staked-avax",
    "stride",
    "tranchess-ether",
    "kava-liquid",
    "strx-finance",
    "jito",
    "bifrost-liquid-crowdloan",
    "pepetam-swaves",
    "veno-finance",
    "stake-link-liquid",
    "nf3-ape",
    "okc-liquid-staking",
    "nucleon",
    "lockless-protocol",
    "hord",
    "trufin-legacy-vaults",
    "wynd-lsd",
    "glif",
    "starfish-liquid-staking",
    "stfil",
    "swell-liquid-staking",
    "stakehouse",
    "quicksilver-protocol",
    "sft-protocol",
    "binance-staked-eth",
    "blazestake",
    "origin-ether",
    "creth2",
    "scanto",
    "nodedao",
    "avely-staking",
    "mfil-protocol",
    "hashmix-fil",
    "liquid-collective",
    "stkd-scrt",
    "minefi",
    "swapscanner-lsd",
    "stakedicp",
    "neopin-liquid",
    "gogopool",
    "xalgo-liquid-staking",
    "collectif-dao",
    "hashking",
    "bemo",
    "meter-liquid-staking",
    "hatom-liquid-staking",
    "trustake",
    "jewelswap-liquid-staking",
  ]
  
  // Update the fetchPools function to handle empty object responses better
  async function fetchPools(): Promise<PoolData[]> {
    try {
      const response = await fetch("https://yields.llama.fi/pools")
      if (!response.ok) {
        throw new Error(`Failed to fetch pools: ${response.status}`)
      }
  
      const responseData = await response.json()
  
      // Log the response for debugging
      console.log("API response structure:", {
        type: typeof responseData,
        isArray: Array.isArray(responseData),
        isEmpty: Object.keys(responseData).length === 0,
        hasData: responseData.data ? true : false,
      })
  
      // Handle empty object response
      if (typeof responseData === "object" && Object.keys(responseData).length === 0) {
        console.warn("API returned an empty object")
        throw new Error("API returned an empty object")
      }
  
      // Check if the response is an array
      if (Array.isArray(responseData)) {
        const allPools = responseData
        // Filter for LST projects, with additional safety checks
        return allPools.filter((pool) => pool && pool.project && LST_PROJECTS.includes(pool.project.toLowerCase()))
      }
  
      // If it's an object with a data property that is an array, use that
      if (responseData && typeof responseData === "object" && Array.isArray(responseData.data)) {
        const allPools = responseData.data
        // Filter for LST projects
        return allPools.filter((pool: { project: string }) => pool && pool.project && LST_PROJECTS.includes(pool.project.toLowerCase()))
      }
  
      // If we can't find an array, log the issue and throw an error
      console.warn("Could not find an array in the API response:", responseData)
      throw new Error("Invalid API response format")
    } catch (error) {
      console.error("Error fetching pools:", error)
      throw error
    }
  }
  
  // Function to fetch historical data for a specific pool
  async function fetchPoolHistory(poolId: string): Promise<HistoricalDataPoint[]> {
    try {
      const response = await fetch(`https://yields.llama.fi/chart/${poolId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch pool history: ${response.status}`)
      }
  
      const data: HistoricalData = await response.json()
  
      if (data.status === "success" && Array.isArray(data.data)) {
        return data.data
      }
  
      return []
    } catch (error) {
      console.error(`Error fetching history for pool ${poolId}:`, error)
      return []
    }
  }
  
  // Group pools by project and calculate aggregated metrics
  function groupPoolsByProject(pools: PoolWithHistory[]): Protocol[] {
    // Create a map to store projects
    const projectMap: Record<string, Protocol> = {}
  
    // Group pools by project
    pools.forEach((pool) => {
      const projectName = pool.name.toLowerCase()
  
      if (!projectMap[projectName]) {
        projectMap[projectName] = {
          name: pool.name,
          tvl: 0,
          apy: 0,
          change_24h: 0,
          change_7d: 0,
          pools: [],
        }
      }
  
      // Add pool to project
      projectMap[projectName].pools.push(pool)
  
      // Add pool TVL to project TVL
      projectMap[projectName].tvl += pool.tvl
    })
  
    // Calculate weighted metrics for each project
    Object.values(projectMap).forEach((project) => {
      const totalWeight = project.tvl
      let weightedApy = 0
      let weighted24hChange = 0
      let weighted7dChange = 0
  
      project.pools.forEach((pool) => {
        const weight = pool.tvl / totalWeight
        weightedApy += pool.apy * weight
        weighted24hChange += pool.change_24h * weight
        weighted7dChange += pool.change_7d * weight
      })
  
      project.apy = weightedApy
      project.change_24h = weighted24hChange
      project.change_7d = weighted7dChange
    })
  
    // Convert map to array and sort by TVL
    return Object.values(projectMap).sort((a, b) => b.tvl - a.tvl)
  }
  
  // Update the fetchLSTData function to handle errors better
  export async function fetchLSTData() {
    try {
      // Step 1: Fetch and filter pools
      const pools = await fetchPools()
  
      // If no pools were found, throw an error
      if (!pools || pools.length === 0) {
        throw new Error("No pools found from API")
      }
  
      // Step 2: For each pool, fetch historical data
      const poolsWithHistory = await Promise.all(
        pools.map(async (pool) => {
          let history: HistoricalDataPoint[] = []
  
          try {
            if (pool.pool) {
              history = await fetchPoolHistory(pool.pool)
            }
          } catch (error) {
            console.error(`Failed to fetch history for ${pool.project}:`, error)
          }
  
          // Transform the data to match our expected format
          return {
            name: pool.project,
            chain: pool.chain,
            symbol: pool.symbol,
            tvl: pool.tvlUsd,
            apy: pool.apy,
            change_24h: pool.apyPct1D || 0,
            change_7d: pool.apyPct7D || 0,
            history: history,
            pool: pool.pool,
            poolMeta: pool.poolMeta,
          }
        }),
      )
  
      // Group pools by project
      const protocols = groupPoolsByProject(poolsWithHistory)
  
      return {
        protocols,
        pools: poolsWithHistory.sort((a, b) => b.tvl - a.tvl),
      }
    } catch (error) {
      console.error("Failed to fetch LST data:", error)
      throw error
    }
  }
  