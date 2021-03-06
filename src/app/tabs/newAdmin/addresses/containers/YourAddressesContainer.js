import { connect } from 'react-redux';
import { YourAddressesComponent } from '../components';

const mapStateToProps = state => ({
  domain: state.auth.name,
  userAddress: state.auth.address,
  chainAddresses: state.newAdmin.addresses.chainAddresses,
  resolverName: state.newAdmin.resolver.resolverName,
});

export default connect(
  mapStateToProps,
)(YourAddressesComponent);
