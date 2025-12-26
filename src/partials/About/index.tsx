import style from './index.module.css'

// Components
import Section from 'components/Section'
import Container, { Row } from 'components/Container'
import ContentBlock from 'components/ContentBlock'
import Square from 'components/Square'
import Heading from 'components/Heading'

// Hooks
import { Trans, useTranslation } from 'react-i18next'

function About() {
  const { t } = useTranslation('translation', { keyPrefix: 'about' })
  const intro: string[] = t('intro', { returnObjects: true })
  const clanTitle: string = t('clan_title')
  const clan: string[] = t('clan', { returnObjects: true })
  const methodTitle: string = t('method_title')
  const method: string[] = t('method', { returnObjects: true })
  const skillsTitle: string = t('skills_title')
  const skills: string[] = t('skills', { returnObjects: true })
  const awardsTitle: string = t('awards_title')
  const awards: string[] = t('awards', { returnObjects: true })
  const teachingTitle: string = t('teaching_title')
  const teaching: string[] = t('teaching', { returnObjects: true })

  return (
    <Section name="about" className={style.root}>
      <Container grid>
        <Row start={3} end={1}>
          <div className={style.section}>
            <ContentBlock key={intro[0]}>
              <div>
                <Trans i18nKey={`about.intro.0`} />
              </div>
            </ContentBlock>
          </div>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={2}>
          <Heading key={intro[1]}>
            <Trans
              i18nKey="about.intro.1"
              components={{
                Square: <Square />,
                pre: <pre />
              }}
            />
          </Heading>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={1}>
          <ContentBlock key={intro[2]}>
            {intro.slice(2).map((txt, i) => (
              <div key={i}>
                <Trans i18nKey={`about.intro.${i + 2}`} />
              </div>
            ))}
          </ContentBlock>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={2} end={2}>
          <div className={style.section}>
            <Heading alignRight key={clanTitle[0]}>
              <>
                {clanTitle[0]}
                <br /> {clanTitle[1]}
              </>
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={2}>
          <div className={style.columns}>
            <ContentBlock key={clan[0]}>
              {clan.slice(0, 2).map((txt, i) => (
                <div key={i}>
                  <Trans i18nKey={`about.clan.${i}`} />
                </div>
              ))}
            </ContentBlock>
            <ContentBlock key={clan[2]}>
              {clan.slice(2).map((txt, i) => (
                <div key={i}>
                  <Trans i18nKey={`about.clan.${i + 2}`} />
                </div>
              ))}
            </ContentBlock>
          </div>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={3}>
          <div className={style.section}>
            <Heading key={methodTitle}>
              <Trans i18nKey="about.method_title" components={{ pre: <pre /> }} />
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={1}>
          <ContentBlock key={method[0]}>
            <div>
              <Trans i18nKey={`about.method.0`} />
            </div>
          </ContentBlock>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={3}>
          <div className={style.section}>
            <Heading key={method[1]}>
              <Trans i18nKey="about.method.1" />
            </Heading>
            <Heading alignRight key={method[2]}>
              <Trans i18nKey="about.method.2" />
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={1} end={1}>
          <div className={style.section}>
            <ContentBlock key={method[3]}>
              <div>
                <Trans i18nKey={`about.method.3`} />
              </div>
            </ContentBlock>
          </div>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={3}>
          <div className={style.section}>
            <Heading key={skillsTitle}>
              <Trans i18nKey="about.skills_title" components={{ pre: <pre /> }} />
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={2}>
          <ContentBlock key={skills[0]}>
            {skills.map((_, i) => (
              <div key={i}>
                <Trans i18nKey={`about.skills.${i}`} />
              </div>
            ))}
          </ContentBlock>
        </Row>
      </Container>
      <Container grid>
        <Row start={1} end={3}>
          <div className={style.section}>
            <Heading className={style.awardsTitle} key={awardsTitle}>
              <Trans i18nKey="about.awards_title" />
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={2}>
          <ContentBlock key={awards[0]}>
            {awards.map((_, i) => (
              <div key={i}>
                <Trans i18nKey={`about.awards.${i}`} />
              </div>
            ))}
          </ContentBlock>
        </Row>
      </Container>
      <Container grid outerRightOnMobile>
        <Row start={1} end={3}>
          <div className={style.section}>
            <Heading key={teachingTitle}>
              <Trans i18nKey="about.teaching_title" />
            </Heading>
          </div>
        </Row>
      </Container>
      <Container grid>
        <Row start={2} end={2}>
          <ContentBlock key={teaching[0]}>
            {teaching.map((_, i) => (
              <div key={i}>
                <Trans i18nKey={`about.teaching.${i}`} />
              </div>
            ))}
          </ContentBlock>
        </Row>
      </Container>
    </Section>
  )
}
export default About
