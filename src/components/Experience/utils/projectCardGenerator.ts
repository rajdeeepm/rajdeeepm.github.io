import * as THREE from 'three'

export type ProjectInfo = {
  name: string
  period: string
  organization: string
  heroOutcome: string
  chips: string[]
  highlights: {
    title: string
    description: string
  }[]
  detailedBullets: string[]
  publicationUrl?: string
}

export const projectDetails: { [key: string]: ProjectInfo } = {
  'accessibility': {
    name: 'Accessibility Agents',
    organization: 'UMich Human AI Lab',
    period: 'Sept 2025 - Present',
    heroOutcome: 'Systematically quantifying the modality gap in SOTA computer-use agents under accessibility constraints to map failure modes and prototype adaptive decision policies.',
    chips: ['CUA Benchmark', 'LSTM-POMDP', 'F1-F8 Taxonomy', 'PPO + SFT', 'Reproducible Eval'],
    highlights: [
      {
        title: 'Research Impact',
        description: 'Preregistered investigation of SOTA agents under Keyboard-Only, Screen-Reader, and High-Zoom constraints with controlled interventions.'
      },
      {
        title: 'Evaluation System',
        description: 'Capability-aware benchmark with success rate, latency, action/error metrics, Wilson CIs, and Cliff\'s δ reporting.'
      },
      {
        title: 'Adaptive Policy',
        description: 'LSTM-based POMDP decision policy mapping observations to reliable actions via SFT + PPO with action masking.'
      }
    ],
    detailedBullets: [
      '<strong>Investigating:</strong> Systematically testing SOTA computer-use agents under preregistered accessibility constraints (Keyboard-Only, Screen-Reader, High-Zoom) and quantifying failure modes to map the modality gap via controlled interventions.',
      '<strong>Building:</strong> Capability-aware benchmark with rigorously defined metrics (success rate, latency, action/error counts, F1–F8 failure taxonomy) and reporting Wilson CIs and Cliff\'s δ in fully reproducible evaluation suite.',
      '<strong>Prototyping:</strong> LSTM-based POMDP decision policy mapping capability-aware observations to reliable keyboard/screen-reader actions, trained via SFT followed by PPO with action masking and compatibility regularization.'
    ]
  },
  'ectss': {
    name: 'EC-TSS',
    organization: 'Independent Research',
    period: 'Oct 2025 - Present',
    heroOutcome: 'Developed a self-supervised temporal fusion system that reduces portrait matting flicker by 25% FCD, 24% HFTE without ground-truth alpha—stabilizing video mattes while avoiding EMA oversmoothing.',
    chips: ['25% FCD ↓', '24% HFTE ↓', 'Self-supervised', 'Motion-compensated', 'Single GPU', 'VideoMatting108'],
    highlights: [
      {
        title: 'System Architecture',
        description: 'Lightweight temporal fusion head (U-Net) refining frozen MODNet backbone with motion-compensated priors and pixel-wise fusion weights.'
      },
      {
        title: 'Self-Supervised Training',
        description: 'No ground-truth alpha required—combines EMA teacher consistency, reliability masking, edge/gradient consistency, and photometric reconstruction.'
      },
      {
        title: 'Stability Metrics',
        description: 'Custom temporally-aware metrics (FCD, HFTE, hair-edge stability, burst ratios) quantifying flicker and jitter reduction across sequences.'
      }
    ],
    detailedBullets: [
      '<strong>Developed:</strong> Lightweight, backbone-agnostic temporal fusion head (shallow U-Net) stabilizing portrait matting by refining frozen per-frame MODNet-style backbone (ONNX) using motion-compensated prior and pixel-wise fusion weights.',
      '<strong>Engineered:</strong> Motion-compensated fusion pipeline with Farnebäck optical flow to warp previous fused matte and derive reliability cues (flow magnitude, occlusion from forward-backward consistency, edge-consistency gating, high-frequency energy) plus learned confidence map driving spatially varying fusion.',
      '<strong>Designed:</strong> Self-supervised training objective using only raw frames and backbone predictions (no ground-truth alpha), combining EMA teacher consistency with reliability masking, symmetric spatial anchoring, edge/gradient consistency, and photometric reconstruction + regularizers to avoid oversmoothing/ghosting.',
      '<strong>Trained + Evaluated:</strong> VideoMatting108 training split with held-out validation clips on single GPU; built temporally-aware stability metrics (flow-compensated delta, high-frequency temporal energy, hair-edge stability + burst ratios) to quantify flicker and edge jitter.',
      '<strong>Demonstrated:</strong> Consistent stability gains over per-frame inference—EC-TSS reduces FCD by 25%, HFTE by ~24%, FCD burst ratio by ~17% versus per-frame, closing much of EMA\'s stability gap without oversmoothing artifacts.'
    ]
  },
  'aerollm': {
    name: 'Aero-LLM',
    organization: 'Oakland University',
    period: 'Sept 2023 - April 2024',
    heroOutcome: 'Led distributed LLM framework for secure UAV communication achieving >82% accuracy—published at IEEE ICCCN 2024.',
    chips: ['>82% Accuracy', 'IEEE ICCCN 2024', 'SFT + RLHF', 'OPT/Llama2', 'SITL/HITL', 'Team Lead'],
    publicationUrl: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=Aero-LLM%20Distributed%20Framework%20Secure%20UAV',
    highlights: [
      {
        title: 'Publication',
        description: 'Team Lead—co-authored paper on distributed framework for secure UAV communication and intelligent decision-making, published at IEEE\'s 33rd ICCCN.'
      },
      {
        title: 'System Design',
        description: 'Designed and implemented Aero-LLM architecture with data collection via software-in-the-loop (SITL) and hardware-in-the-loop (HITL) environments.'
      },
      {
        title: 'Model Performance',
        description: 'Fine-tuned OPT/Llama2 LLMs using SFT and RLHF, achieving >82% accuracy, high precision, recall, and F1 scores for UAV communication.'
      }
    ],
    detailedBullets: [
      '<strong>Led:</strong> Research on Aero-LLM distributed framework for secure UAV communication and intelligent decision-making—co-authored paper published at IEEE\'s 33rd International Conference on Computer Communications and Networks (ICCCN) in July 2024.',
      '<strong>Designed + Implemented:</strong> Complete Aero-LLM architecture with data collection using software-in-the-loop (SITL) and hardware-in-the-loop (HITL) environments.',
      '<strong>Fine-tuned:</strong> Multiple OPT/Llama2 LLMs using both SFT and RLHF, achieving optimized model performance and enhanced decision-making capabilities for UAV communication systems.',
      '<strong>Achieved:</strong> High accuracy (>82%), precision, recall, and F1 scores with minimal error rates across extensive experimental validation.'
    ]
  },
  'net-gpt': {
    name: 'Net-GPT',
    organization: 'Oakland University',
    period: 'May 2023 - Aug 2023',
    heroOutcome: 'Developed LLM-powered man-in-the-middle chatbot hijacking UAV-GCS communication with 95.3% predictive accuracy—published at ACM/IEEE EdgeSP 2023.',
    chips: ['95.3% Accuracy', 'ACM/IEEE EdgeSP 2023', 'Llama-2-7B/13B', 'MitM Attack', 'Network Packets', 'UAV Security'],
    publicationUrl: 'https://dl.acm.org/doi/proceedings/10.1145/3565478',
    highlights: [
      {
        title: 'Publication',
        description: 'Co-authored paper on LLM-empowered man-in-the-middle chatbot for UAV hijacking, published at Fifth ACM/IEEE Workshop on Security and Privacy in Edge Computing.'
      },
      {
        title: 'Attack System',
        description: 'Designed and implemented attacks enabling Net-GPT to hijack benign UAVs and gain control over UAV–GCS communication sessions.'
      },
      {
        title: 'Model Accuracy',
        description: 'Fine-tuned Llama-2-7B (95.3%) and Llama-2-13B (94.1%) for accurate network packet generation and UAV-GCS communication simulation.'
      }
    ],
    detailedBullets: [
      '<strong>Researched + Developed:</strong> Net-GPT—LLM-empowered man-in-the-middle chatbot for unmanned aerial vehicle hijacking—co-authored paper published at EdgeSP: Fifth ACM/IEEE Workshop on Security and Privacy in Edge Computing in December 2023.',
      '<strong>Designed + Implemented:</strong> Attacks enabling Net-GPT to hijack benign UAVs and gain control over communication session between UAVs and Ground Control Stations (GCS).',
      '<strong>Fine-tuned:</strong> Llama-2-7B and Llama-2-13B with extensive experiments, achieving impressive predictive accuracy of 95.3% and 94.1%, respectively—explored trade-off between dataset quantity and fine-tuning epochs.',
      '<strong>Evaluated:</strong> Generative accuracy and analyzed errors for different LLMs; explored cost-efficiency of data size and fine-tuning epochs—demonstrated LLM potential in producing accurate network packets and simulating UAV-GCS communications.'
    ]
  },
  'heterogeneous-dataset': {
    name: 'Heterogeneous Dataset',
    organization: 'Oakland University',
    period: 'Jan 2023 - April 2023',
    heroOutcome: 'Researched and constructed heterogeneous generative dataset for unmanned aerial systems—published at IEEE MOST 2023.',
    chips: ['IEEE MOST 2023', 'UAS Dataset', 'Generative Data', 'Research Publication'],
    publicationUrl: 'https://ieeexplore.ieee.org/document/10147369',
    highlights: [
      {
        title: 'Research Contribution',
        description: 'Co-authored paper on heterogeneous generative dataset construction for unmanned aerial systems.'
      },
      {
        title: 'Publication',
        description: 'Published at IEEE International Conference on Mobility, Operations, Services and Technologies (MOST) in May 2023.'
      },
      {
        title: 'Dataset Engineering',
        description: 'Designed and built comprehensive heterogeneous dataset enabling diverse UAS research applications.'
      }
    ],
    detailedBullets: [
      '<strong>Researched + Constructed:</strong> Heterogeneous Generative Dataset for unmanned aerial systems (UAS)—co-authored paper published by IEEE International Conference on Mobility, Operations, Services and Technologies (MOST) in May 2023.'
    ]
  },
  'aws-agentic': {
    name: 'AWS Agentic System',
    organization: 'Amazon Web Services',
    period: 'May 2025 - Aug 2025',
    heroOutcome: 'Shipped production LLM agent generating config files from prompts—24× faster, 95.8% effort reduction, 99%+ accuracy.',
    chips: ['24× Faster', '95.8% Efficiency ↑', '99%+ Accuracy', 'Production System', 'Multi-LLM', 'Synthetic Data'],
    highlights: [
      {
        title: 'Outcome',
        description: 'Delivered prompt→config automation with measurable productivity lift and strong exact-match reliability in production environment.'
      },
      {
        title: 'System',
        description: 'Built modular agentic architecture designed to be reused across adjacent workflows and projects.'
      },
      {
        title: 'Evaluation + Data',
        description: 'Created synthetic long-tail dataset + multi-model benchmarking harness (accuracy / latency / cost).'
      }
    ],
    detailedBullets: [
      '<strong>Shipped:</strong> Production agentic LLM system auto-generating configuration files with simple user prompt—24× faster, boosting efficiency by 95.8% at 99%+ accuracy—engineered modular, extensible architecture to be reused across adjacent projects.',
      '<strong>Built:</strong> Multi-LLM inference harness to benchmark foundation models across accuracy, latency, and cost for experiment trials.',
      '<strong>Created:</strong> Comprehensive synthetic dataset modeling real-world ambiguities and long-tail edge cases; used for both training and evaluation.',
      '<strong>Fine-tuned:</strong> Foundation models on synthetic and curated data to maximize exact-match performance and robustness with instruction tuning.'
    ]
  },
  'multimodal': {
    name: 'Multimodal Web Agents',
    organization: 'UMich EECS 545',
    period: 'Jan 2025 - May 2025',
    heroOutcome: 'Extended DeepSeek R1 with multimodal capabilities—WebShop +15.6% relative accuracy, WebArena +60% relative accuracy.',
    chips: ['WebShop 52%', 'WebArena +60%', 'DeepSeek R1', 'Whisper Audio', 'Llama Vision', 'FAISS Memory'],
    highlights: [
      {
        title: 'Multimodal Extension',
        description: 'Extended DeepSeek R1 adding audio via Whisper and image/UI understanding via Llama 3.2 90B Vision—unified into single action schema.'
      },
      {
        title: 'Persistent Memory',
        description: 'Upgraded from episodic to persistent cross-session recall using FAISS vector store backed by Gemini embeddings with memory hooks in tool-use loop.'
      },
      {
        title: 'Performance Gains',
        description: 'WebShop accuracy 52% vs 45% (+7pp, +15.6% relative); WebArena 24% vs 15% (+9pp, +60% relative).'
      }
    ],
    detailedBullets: [
      '<strong>Extended:</strong> DeepSeek R1 for multimodality, adding audio via OpenAI Whisper and image/UI understanding via Llama 3.2 90B Vision—unified modalities into single action schema for planning and tool use.',
      '<strong>Upgraded:</strong> Agent memory from episodic to persistent, cross-session recall by designing FAISS vector store backed by Gemini text embeddings—implemented memory read/write hooks directly in tool-use loop.',
      '<strong>Achieved:</strong> WebShop accuracy 52% vs 45% (+7pp, +15.6% relative); WebArena 24% vs 15% (+9pp, +60% relative).'
    ]
  },
  'vti-aero': {
    name: 'VTI Aero',
    organization: 'PJTL at MCity',
    period: 'Jan 2025 - April 2025',
    heroOutcome: 'Engineered GPS-independent drone localization system with AI voice interface for autonomous navigation and spoken command execution.',
    chips: ['GPS-Independent', 'Sensor Fusion', 'Real-Time', 'AI Voice Interface', 'Autonomous Nav', 'Pose Estimation'],
    highlights: [
      {
        title: 'Localization System',
        description: 'Real-time, GPS-independent localization integrating advanced sensor fusion algorithms and on-board processing for autonomous navigation.'
      },
      {
        title: 'AI Voice Interface',
        description: 'AI-driven voice command system leveraging speech-to-text and ML models to interpret and execute complex spoken instructions.'
      },
      {
        title: 'System Integration',
        description: 'Enabled precise pose estimation without external positioning systems, enhancing operational flexibility and user interaction.'
      }
    ],
    detailedBullets: [
      '<strong>Engineered:</strong> Real-time, GPS-independent localization system by integrating advanced sensor fusion algorithms and on-board processing capabilities—enabling autonomous drone navigation and precise pose estimation without external positioning systems.',
      '<strong>Developed:</strong> Design for AI-driven voice command interface leveraging speech-to-text technologies and machine learning models to interpret and execute complex spoken instructions—enhancing user interaction and operational flexibility of the drone.'
    ]
  },
  'retrospect-ai': {
    name: 'Retrospect AI',
    organization: 'PJTL at MCity',
    period: 'Aug 2024 - Dec 2024',
    heroOutcome: 'Developed real-time trajectory emulator processing 1000+ points per run with millisecond precision for autonomous vehicle safety analysis.',
    chips: ['1000+ Points/Run', 'Millisecond Precision', '5000+ Data Points', 'Python', 'Spline Interpolation', 'AV Safety'],
    highlights: [
      {
        title: 'Trajectory Emulator',
        description: 'Real-time simulation utilizing spline interpolation and parameterized paths with acceleration and jerk constraints for vehicle motion analysis.'
      },
      {
        title: 'Data Pipeline',
        description: 'Parsed and analyzed 5000+ data points from CSV input, generating six key motion analysis graphs for trajectory planning optimization.'
      },
      {
        title: 'Performance Analysis',
        description: 'Enabled millisecond-precision processing for autonomous vehicle safety evaluation and system performance optimization.'
      }
    ],
    detailedBullets: [
      '<strong>Developed:</strong> Trajectory emulator in Python utilizing spline interpolation and parameterized paths—enabling real-time simulation of vehicle motion with acceleration and jerk constraints, processing 1000+ trajectory points per run with millisecond precision analyzing autonomous vehicle safety.',
      '<strong>Engineered:</strong> Data processing pipeline that parsed and analyzed 5000+ data points from CSV input—generating six key motion analysis graphs (trajectory, velocity, acceleration, and jerk) to optimize vehicle trajectory planning and system performance evaluation.'
    ]
  }
}

export function createProjectCardTexture(projectKey: string, isBack: boolean = false): THREE.CanvasTexture {
  const project = projectDetails[projectKey]
  if (!project) {
    console.error(`Project ${projectKey} not found`)
    return createPlaceholderTexture()
  }

  if (isBack) {
    return createBackCardTexture(project)
  }

  return createFrontCardTexture(project)
}

function createFrontCardTexture(project: ProjectInfo): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1536
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let yPos = 110

  // Project name with wrapping if too long
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'  // Primary text color
  ctx.font = '900 100px Arial'
  ctx.letterSpacing = '2px'
  const nameLines = wrapText(ctx, project.name, canvas.width - 120)
  nameLines.slice(0, 1).forEach(line => {  // Show only first line of name
    ctx.fillText(line, 60, yPos)
  })
  yPos += 35

  // Organization and period with wrapping
  ctx.fillStyle = 'rgba(255, 255, 255, 0.48)'  // Secondary text color
  ctx.font = '400 32px Arial'
  ctx.letterSpacing = '0px'
  const orgText = `${project.organization} · ${project.period}`
  const orgLines = wrapText(ctx, orgText, canvas.width - 120)
  orgLines.slice(0, 1).forEach(line => {  // Show only first line
    ctx.fillText(line, 60, yPos)
  })
  yPos += 45

  // Publication link with wrapping
  if (project.publicationUrl) {
    ctx.fillStyle = 'rgba(255, 203, 5, 0.9)'  // Maize accent
    ctx.font = '400 28px Arial'
    ctx.fillText('Link to paper: ', 60, yPos)
    const linkLabelWidth = ctx.measureText('Link to paper: ').width
    ctx.fillStyle = 'rgba(200, 220, 255, 0.95)'  // Pale blue for URL
    ctx.font = '400 24px Arial'  // Smaller font for URL
    const urlLines = wrapText(ctx, project.publicationUrl, canvas.width - 120 - linkLabelWidth)
    ctx.fillText(urlLines[0] || project.publicationUrl, 60 + linkLabelWidth, yPos)
  }
  yPos += 30

  // Hero outcome (white/pale blue, not yellow - max 2 lines)
  ctx.fillStyle = 'rgba(200, 220, 255, 0.95)'  // Pale blue instead of yellow
  ctx.font = '500 48px Arial'
  const heroLines = wrapText(ctx, project.heroOutcome, canvas.width - 120)  // Constrain width
  const maxHeroLines = 2
  heroLines.slice(0, maxHeroLines).forEach(line => {
    ctx.fillText(line, 60, yPos)
    yPos += 58
  })
  yPos += 40

  // Stats chips (smaller, cleaner, subtler) with wrapping
  let chipX = 60
  const chipY = yPos
  const chipHeight = 42  // Smaller height (was 55)
  const chipPadding = 22
  const chipSpacing = 14
  let currentRowY = chipY

  project.chips.forEach((chip, index) => {
    ctx.font = '500 24px Arial'  // Smaller, medium weight
    const chipWidth = ctx.measureText(chip).width + chipPadding * 2

    // Wrap to next line if chip would go off edge
    if (chipX + chipWidth > canvas.width - 60) {
      chipX = 60
      currentRowY += chipHeight + chipSpacing
    }

    // Subtle chip background (less opacity)
    ctx.fillStyle = 'rgba(80, 140, 255, 0.08)'
    roundRect(ctx, chipX, currentRowY, chipWidth, chipHeight, 8)
    ctx.fill()

    // Subtle border (no heavy glow)
    ctx.strokeStyle = 'rgba(120, 160, 255, 0.20)'
    ctx.lineWidth = 1
    roundRect(ctx, chipX, currentRowY, chipWidth, chipHeight, 8)
    ctx.stroke()

    // Clean white text (not neon blue)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)'
    ctx.fillText(chip, chipX + chipPadding, currentRowY + 29)

    chipX += chipWidth + chipSpacing
  })
  yPos = currentRowY + chipHeight + 65

  // 3 Highlight tiles (premium design with better hierarchy)
  const tileWidth = (canvas.width - 140) / 3
  const tileHeight = 450
  const tileGap = 25

  project.highlights.forEach((highlight, index) => {
    const tileX = 60 + (tileWidth + tileGap) * index
    const tileY = yPos

    // Tile background (subtle)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    roundRect(ctx, tileX, tileY, tileWidth, tileHeight, 16)
    ctx.fill()

    // Tile border (very subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    roundRect(ctx, tileX, tileY, tileWidth, tileHeight, 16)
    ctx.stroke()

    // Accent bar on left (maize - ONLY accent color used)
    ctx.fillStyle = 'rgba(255, 203, 5, 0.9)'
    roundRect(ctx, tileX + 28, tileY + 35, 5, 60, 3)
    ctx.fill()

    clipRect(ctx, tileX + 40, tileY + 30, tileWidth - 80, tileHeight - 60, () => {
      // Tile title (bold, clean white)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
      ctx.font = '700 44px Arial'
      const titleLines = wrapText(ctx, highlight.title, tileWidth - 90)
      let titleY = tileY + 85
      titleLines.forEach(line => {
        ctx.fillText(line, tileX + 55, titleY)
        titleY += 52
      })

      // Tile description (better contrast, proper line-height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)'  // Improved readability
      ctx.font = '400 32px Arial'  // Slightly larger for glass blur
      const descLines = wrapText(ctx, highlight.description, tileWidth - 75)
      const maxDescLines = 6  // Limit to prevent overflow
      let descY = titleY + 40
      descLines.slice(0, maxDescLines).forEach(line => {
        ctx.fillText(line, tileX + 55, descY)
        descY += 46  // Better line-height (1.5x)
      })
    })
  })

  yPos += tileHeight + 45

  // "Click to view details" indicator at bottom center
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = '600 36px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Click to view details ↻', canvas.width / 2, canvas.height - 70)
  ctx.textAlign = 'left'

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createBackCardTexture(project: ProjectInfo): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1536
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let yPos = 110

  // Header
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'  // Clean white
  ctx.font = '900 95px Arial'
  ctx.fillText(project.name, 60, yPos)
  yPos += 40

  ctx.fillStyle = 'rgba(255, 255, 255, 0.48)'  // Low contrast
  ctx.font = '400 32px Arial'
  ctx.fillText('Detailed Overview', 60, yPos)
  yPos += 100

  const bulletClipTop = yPos - 60
  const bulletClipHeight = canvas.height - yPos - 120
  clipRect(ctx, 40, bulletClipTop, canvas.width - 80, bulletClipHeight, () => {
    // Beat-style bullets with accent lines
    project.detailedBullets.forEach((bullet, index) => {
      // Left accent line (maize - rare secondary accent)
      ctx.fillStyle = 'rgba(255, 203, 5, 0.9)'
      roundRect(ctx, 60, yPos - 45, 5, 60, 3)
      ctx.fill()

      // Parse HTML bold tags and render
      const lines = wrapText(ctx, bullet.replace(/<\/?strong>/g, ''), canvas.width - 160)
      ctx.font = '400 36px Arial'

      lines.forEach((line, lineIndex) => {
        // Check if this line starts with a bold label
        const boldMatch = bullet.match(/<strong>([^<]+)<\/strong>/)
        if (lineIndex === 0 && boldMatch) {
          const boldText = boldMatch[1]
          const restText = line.substring(boldText.length)

          // Draw bold part (maize for labels)
          ctx.font = '700 38px Arial'
          ctx.fillStyle = 'rgba(255, 203, 5, 0.95)'
          ctx.fillText(boldText, 90, yPos)

          // Draw rest (clean white)
          const boldWidth = ctx.measureText(boldText).width
          ctx.font = '400 36px Arial'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'  // Better readability
          ctx.fillText(restText, 90 + boldWidth, yPos)
        } else {
          ctx.font = '400 36px Arial'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'
          ctx.fillText(line, 90, yPos)
        }
        yPos += 48  // Better line-height
      })
      yPos += 35
    })
  })

  // "Click to return" indicator
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = '500 32px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Click to return ↻', canvas.width / 2, canvas.height - 70)
  ctx.textAlign = 'left'

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  })
  if (currentLine) {
    lines.push(currentLine)
  }
  return lines
}

function addNoiseOverlay(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 8  // Reduced from 15 to 8 for subtlety
    data[i] += noise     // R
    data[i + 1] += noise // G
    data[i + 2] += noise // B
  }

  ctx.putImageData(imageData, 0, 0)
}

function clipRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  draw: () => void
) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.clip()
  draw()
  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function createPlaceholderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#333333'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px Arial'
  ctx.fillText('Project Info', 40, 80)

  return new THREE.CanvasTexture(canvas)
}
