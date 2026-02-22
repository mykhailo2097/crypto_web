export interface AESCipher {
  name: string
  name_ua: string
  description: string
  status: string
  type: string
  security_level: string
  features: string[]
  key_formats: string[]
  parameters: {
    key_size_bits: number
    key_size_bytes: number
    block_size_bits: number
    block_size_bytes: number
    iv_size_bytes: number
    mode: string
    padding: string
  }
  use_cases: string[]
}

export interface AffineCipher {
  name: string
  name_ua: string
  description: string
  status: string
  type: string
  features: string[]
  mathematical_basis: string[]
  parameters: {
    affine_formula: string
    inverse_formula: string
    encoding: string
    key_a_condition: string
    key_s_condition: string
  }
  key_structure: {
    p_values: string
    a_values: string
    s_values: string
    security_note: string
  }
  use_cases: string[]
}
