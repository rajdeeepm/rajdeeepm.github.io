import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

type Project = {
  name: string
  url: string
  videoID: string
}

const initialState: Project[] = [
  {
    name: 'Aero-LLM',
    url: 'aerollm',
    videoID: 'aerollmReel'
  },
  {
    name: 'AWS Agentic System',
    url: 'aws-agentic',
    videoID: 'awsReel'
  },
  {
    name: 'Accessibility Agents',
    url: 'accessibility',
    videoID: 'accessReel'
  },
  {
    name: 'Multimodal Web Agents',
    url: 'multimodal',
    videoID: 'multimodalReel'
  },
  {
    name: 'EC-TSS',
    url: 'ectss',
    videoID: 'ectssReel'
  },
  {
    name: 'VTI Aero',
    url: 'vti-aero',
    videoID: 'vtiReel'
  },
  {
    name: 'Retrospect AI',
    url: 'retrospect-ai',
    videoID: 'retrospectReel'
  },
  {
    name: 'Net-GPT',
    url: 'net-gpt',
    videoID: 'netgptReel'
  },
  {
    name: 'Heterogeneous Generative Dataset',
    url: 'heterogeneous-dataset',
    videoID: 'heteroDataReel'
  }
]

export const projects = createModel<RootModel>()({
  state: initialState
})
