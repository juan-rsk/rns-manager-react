import { connect } from 'react-redux';
import { AddressInputComponent } from '../../../../components';
import { setSubdomainOwner } from '../operations';
import { errorSetSubdomainOwner, successSetSubdomainOwnerClose } from '../actions';
import { EMPTY_ADDRESS } from '../../types';

const mapStateToProps = state => ({
  domain: state.auth.name,
  editDomain: state.newAdmin.subdomains.editDomain,
  editError: state.newAdmin.subdomains.editError,
  allowRsk: true,
});

const mapDispatchToProps = dispatch => ({
  handleSubmit: (domain, subdomain, newaddress, currentOwner) => dispatch(
    setSubdomainOwner(domain, subdomain, newaddress.toLowerCase(), currentOwner.toLowerCase()),
  ),
  handleErrorClose: subdomain => dispatch(errorSetSubdomainOwner(subdomain, '')),
  handleSuccessClose: subdomain => dispatch(successSetSubdomainOwnerClose(subdomain)),
  handleDelete: (domain, subdomain, currentOwner) => dispatch(
    setSubdomainOwner(domain, subdomain, EMPTY_ADDRESS, currentOwner),
  ),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  handleSubmit: newAddress => dispatchProps.handleSubmit(
    stateProps.domain, ownProps.label, newAddress, ownProps.value,
  ),
  handleErrorClose: () => dispatchProps.handleErrorClose(ownProps.label),
  handleSuccessClose: () => dispatchProps.handleSuccessClose(ownProps.label),
  handleDelete: () => dispatchProps.handleDelete(stateProps.domain, ownProps.label, ownProps.value),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(AddressInputComponent);
