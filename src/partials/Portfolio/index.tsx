// Style
import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import Heading from 'components/Heading'
import { Trans } from 'react-i18next'
import { projectDetails } from 'components/Experience/utils/projectCardGenerator'

// Hooks
import { useTranslation } from 'react-i18next'

const projectOrder = [
  'accessibility',
  'ectss',
  'aws-agentic',
  'multimodal',
  'vti-aero',
  'retrospect-ai',
  'aerollm',
  'net-gpt',
  'heterogeneous-dataset'
]

const stripHtml = (value: string) =>
  value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?strong>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function Portfolio() {
  const { t } = useTranslation('translation', { keyPrefix: 'portfolio' })
  const intro: string[] = t('intro', { returnObjects: true })
  const portfolio: string[] = t('portfolio', { returnObjects: true })

  return (
    <Section name="portfolio" className={style.root}>
      <Container grid outerRightOnMobile>
        <Row start={1} end={2}>
          <Heading misaligned key={intro[0]}>
            <>
              <pre className={style.pre}>{intro[0]}</pre>
              <Trans i18nKey="portfolio.intro.1" />
            </>
          </Heading>
        </Row>
      </Container>
      <Container grid key={intro[2]}>
        <Row start={3} end={1}>
          <ContentBlock>
            <div>{intro[2]}</div>
            <div>{intro[3]}</div>
          </ContentBlock>
        </Row>
      </Container>
      <Container grid outerRightOnMobile className={style.projectSection}>
        <Row start={2} end={2}>
          <Heading key={portfolio[0]}>{portfolio[0]}</Heading>
        </Row>
      </Container>
      <Container grid key={portfolio[1]}>
        <Row start={2} end={1}>
          <ContentBlock>
            <div>
              <Trans i18nKey="portfolio.portfolio.1" />
              <Trans i18nKey="portfolio.portfolio.2" />
            </div>
          </ContentBlock>
        </Row>
      </Container>

      <div className={style.cardContainer} id="card-container" />

      <div className={style.srOnly} aria-label="Project details for search">
        <ul>
          {projectOrder.map((key) => {
            const project = projectDetails[key]
            if (!project) return null

            return (
              <li key={key}>
                <h3>{project.name}</h3>
                <p>{`${project.organization} • ${project.period}`}</p>
                <p>{stripHtml(project.heroOutcome)}</p>
                {project.publicationUrl && (
                  <p>
                    <a href={project.publicationUrl} target="_blank" rel="noopener noreferrer">
                      View Publication
                    </a>
                  </p>
                )}
                <p>{`Tags: ${project.chips.join(', ')}`}</p>
                <div>
                  {project.highlights.map((highlight) => (
                    <p key={highlight.title}>
                      {highlight.title}: {stripHtml(highlight.description)}
                    </p>
                  ))}
                </div>
                <div>
                  {project.detailedBullets.map((bullet, index) => (
                    <p key={`${key}-${index}`}>{stripHtml(bullet)}</p>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Videos removed - they were consuming CPU/GPU resources even when hidden */}
      {/* Video elements can be added back if needed for specific project pages */}
    </Section>
  )
}
export default Portfolio
