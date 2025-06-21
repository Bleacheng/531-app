import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v2'
import { themes } from '@tamagui/themes'

const tamaguiConfig = createTamagui({
  ...config,
  themes,
})

export default tamaguiConfig 