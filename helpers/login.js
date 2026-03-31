//import OneSignal from 'react-native-onesignal';
import { apiUrl } from './urls';

const withEmailAddressAndPassword = async function(userType, emailAddress, password) {
  console.log('Login: Attempt to login with creds: ' + userType + ' ' + emailAddress + ' ');
  var body = {
    identityType: 'docme',
    userType: userType,
    emailAddress: emailAddress,
    password: password
  };
  return fetch(apiUrl('/' + userType + '/authenticate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  .then((response) => { 
    if (response.status == 200) {
      return response.json()
      .then((responseJson) => {
        if (responseJson.isSuccess) {
          console.log('Login: Logged-in: ' + JSON.stringify(responseJson));
          _setOneSignalExternalUserId(userType, responseJson.doctor?.id || responseJson.patient?.id);
          return responseJson;
        }
      })
    }
    return undefined;
  })
  .catch((error) => {
    console.error(error);
    return undefined;
  });
}

const withToken = async function(userType, token) {
  console.log('Login: Attempt to login with user type and token: ' + userType + ' ' + token);
  return fetch(apiUrl('/' + userType + '/authorize'), {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then((response) => { 
    if (response.status == 200) {
      return response.json()
      .then((responseJson) => {
        if (responseJson.isSuccess) {
          console.log('Login: Logged-in: ' + JSON.stringify(responseJson));
          _setOneSignalExternalUserId(userType, responseJson.doctor?.id || responseJson.patient?.id);
          return responseJson;
        }
      })
    }
    return undefined;
  })
  .catch((error) => {
    console.error(error);
    return undefined;
  });
};

function _setOneSignalExternalUserId(userType, id) {
  /*
  OneSignal.setExternalUserId(userType + id, (results) => {
    console.log('OneSignal: Results of setting external user id: ' + JSON.stringify(results));
    if (results.push && results.push.success) {
      console.log('OneSignal: Results of setting external user id push status: ' + results.push.success);
    }
  });
  */
};

export default {
  withEmailAddressAndPassword: withEmailAddressAndPassword,
  withToken: withToken,
};
