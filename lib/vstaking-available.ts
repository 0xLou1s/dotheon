export const VSTAKING_AVAILABLE = {
  vDOT: true,
  vETH: true,
  vBNC: false,
  vFIL: false,
  vMOVR: false,
  vGLMR: false,
  vMANTA: false,
  vASTR: false,
  vKSM: false,
  vPHA: false
} as const;

export type VTokenSymbol = keyof typeof VSTAKING_AVAILABLE; 