// Style
import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import Heading from 'components/Heading'
import { Trans } from 'react-i18next'

// Hooks
import { useTranslation } from 'react-i18next'

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

      <video id="aerollmReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/aerollm/reel.mp4" type="video/mp4" />
      </video>
      <video id="awsReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/aws-agentic/reel.mp4" type="video/mp4" />
      </video>
      <video id="accessReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/accessibility/reel.mp4" type="video/mp4" />
      </video>
      <video id="multimodalReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/multimodal/reel.mp4" type="video/mp4" />
      </video>
      <video id="ectssReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/ectss/reel.mp4" type="video/mp4" />
      </video>
      <video id="vtiReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/vti-aero/reel.mp4" type="video/mp4" />
      </video>
      <video id="retrospectReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/retrospect-ai/reel.mp4" type="video/mp4" />
      </video>
      <video id="netgptReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/net-gpt/reel.mp4" type="video/mp4" />
      </video>
      <video id="heteroDataReel" autoPlay muted loop playsInline className={style.video}>
        <source src="/projects/heterogeneous-dataset/reel.mp4" type="video/mp4" />
      </video>
    </Section>
  )
}
export default Portfolio
