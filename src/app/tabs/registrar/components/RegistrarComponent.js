import React, { Component } from 'react';
import propTypes from 'prop-types';
import { multilanguage } from 'redux-multilanguage';
import { Link } from 'react-router-dom';
import { Container, Card, Spinner } from 'react-bootstrap';
import {
  RentalPeriodContainer, CommitContainer, RevealContainer, LoadingContainer, AutoLoginComponent,
} from '../containers';
import { isValidName } from '../../../validations';
import { StartButtonContainer } from '../../../auth/containers';
import UserErrorComponent from '../../../components/UserErrorComponent';
import { shuffle } from '../helpers';
import TextRotationComponent from '../../../components/TextRotationComponent';
import keyMessages from '../../../../languages/key_messges.json';

class RegistrarComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invalid: null,
    };

    this.stepsMenu = this.stepsMenu.bind(this);
  }

  componentDidMount() {
    const { domain, getState, checkIfAlreadyRegistered } = this.props;
    if (domain && this.validate() && getState) getState(domain);
    checkIfAlreadyRegistered(domain);
  }

  validate() {
    const { domain } = this.props;
    const invalid = isValidName(domain);
    this.setState({ invalid });
    return !invalid;
  }

  stepsMenu() {
    const {
      strings,
      committed,
      waiting,
      revealConfirmed,
    } = this.props;
    const activeClass = 'btn-active';
    const defaultClass = 'btn-outline-primary';

    return (
      <ul className="list-inline steps">
        <li>
          <div className={`btn ${!committed || waiting ? activeClass : defaultClass}`}>
            {`1. ${strings.request_domain}`}
          </div>
        </li>
        <li>
          <div className={`btn ${(committed && !waiting && !revealConfirmed) ? activeClass : defaultClass}`}>
            {`2. ${strings.register_domain}`}
          </div>
        </li>
        <li>
          <div className={`btn ${revealConfirmed ? activeClass : defaultClass}`}>
            {`3. ${strings.login}`}
          </div>
        </li>
      </ul>
    );
  }

  render() {
    const {
      strings, domain, owned, blocked, domainStateLoading, owner, requestingOwner,
      committed, waiting, canReveal, revealConfirmed, walletAddress, errorMessage,
      handleCloseClick, language,
    } = this.props;
    const { invalid } = this.state;

    let elementToRender;

    if (invalid) {
      elementToRender = <h4>{invalid}</h4>;
    } else if (domainStateLoading) {
      elementToRender = <Spinner animation="grow" variant="primary" />;
    } else if (owned) {
      if (requestingOwner) {
        elementToRender = (
          <Card.Text>
            {strings.owned}
            <br />
            <Spinner animation="grow" variant="primary" />
          </Card.Text>
        );
      } else {
        const isOwner = walletAddress === owner.toLowerCase();
        elementToRender = (
          <Container className="page">
            <Card>
              <Card.Header>{strings.owned}</Card.Header>
              <Card.Body>
                <p>
                  <strong>
                    {strings.owner}
                    {': '}
                  </strong>
                  {owner}
                </p>
                <p>
                  {isOwner && <StartButtonContainer />}
                  {!isOwner && <Link to={`/resolve?name=${domain}.rsk`} className="btn btn-primary">{strings.resolve}</Link> }
                </p>
              </Card.Body>
            </Card>
          </Container>
        );
      }
    } else if (blocked) {
      elementToRender = <Container className="page"><h4>{strings.blocked_domain}</h4></Container>;
    } else {
      const domainDisplay = `${domain}.rsk`;

      elementToRender = (
        <Container className="register page">
          <div className="row">
            <div className="col-md-12">
              <h1 className="sub-heading">
                {strings.registering}
                {': '}
                <br />
                <span className="domain">{domainDisplay}</span>
              </h1>
            </div>
          </div>
          {this.stepsMenu()}

          {!committed
            && (
            <div className="requestDomain row">
              <div className="col-md-6 offset-md-3">
                <RentalPeriodContainer />
              </div>
              <CommitContainer />
            </div>
            )
          }

          {waiting && (
            <>
              <LoadingContainer />
              <TextRotationComponent
                messages={shuffle(keyMessages)}
                language={language}
                heading={strings.did_you_know}
                timer={6000}
              />
              <p style={{ marginTop: '50px' }}>
                <a
                  href="https://hackmd.io/@ilanolkies/rns-user-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {strings.download_guide}
                </a>
              </p>
            </>
          )}

          {(canReveal && !revealConfirmed)
            && (
            <RevealContainer />
            )
          }

          {revealConfirmed
            && (
              <AutoLoginComponent />
            )
          }

          <UserErrorComponent
            visible={errorMessage !== ''}
            message={errorMessage}
            handleCloseClick={handleCloseClick}
          />
        </Container>
      );
    }

    return (
      <div>
        {elementToRender}
      </div>
    );
  }
}

RegistrarComponent.propTypes = {
  strings: propTypes.shape({
    owner: propTypes.string.isRequired,
    resolve: propTypes.string.isRequired,
    owned: propTypes.string.isRequired,
    blocked_domain: propTypes.string.isRequired,
    registering: propTypes.string.isRequired,
    request_domain: propTypes.string.isRequired,
    register_domain: propTypes.string.isRequired,
    login: propTypes.string.isRequired,
    did_you_know: propTypes.string.isRequired,
    download_guide: propTypes.string.isRequired,
  }).isRequired,
  domain: propTypes.string.isRequired,
  domainStateLoading: propTypes.bool.isRequired,
  owned: propTypes.bool,
  blocked: propTypes.bool,
  owner: propTypes.string,
  walletAddress: propTypes.string,
  requestingOwner: propTypes.bool.isRequired,
  getState: propTypes.func.isRequired,
  committed: propTypes.bool.isRequired,
  waiting: propTypes.bool.isRequired,
  canReveal: propTypes.bool.isRequired,
  revealConfirmed: propTypes.bool,
  checkIfAlreadyRegistered: propTypes.func.isRequired,
  errorMessage: propTypes.string.isRequired,
  handleCloseClick: propTypes.func.isRequired,
  language: propTypes.string.isRequired,
};

RegistrarComponent.defaultProps = {
  owned: false,
  blocked: false,
  owner: '',
  walletAddress: null,
  revealConfirmed: false,
};

export default multilanguage(RegistrarComponent);
