/** @flow */
import waitForVar from '../utils/waitForVar';

import type { AppleAuthOptions, AppleAuthResponse } from '../types';

const APPLE_SCRIPT_SRC: string =
  'https://api.punch.zone/auth/v2/apple/appleid.auth.js';

/**
 * Performs an apple ID signIn operation
 */
const signIn = ({
  authOptions,
  onSuccess,
  onError,
}: {
  authOptions: AppleAuthOptions,
  onSuccess?: Function,
  onError?: Function,
}): Promise<?AppleAuthResponse> =>
  /** wait for apple sript to load */
  waitForVar('AppleID')
    .then(() => {
      /** Handle if appleID script was not loaded -- log + throw error to be caught below */
      if (!window.AppleID) {
        console.error(new Error('Error loading apple script'));
      }
      /** Init apple auth */
      window.AppleID.auth.init(authOptions);
      /** Signin to appleID */
      return window.AppleID.auth
        .signIn()
        .then((response) => {
          /** This is only called in case usePopup is true */
          if (onSuccess) {
            onSuccess(response);
          }
          /** resolve with the reponse */
          return response;
        })
        .catch((err) => {
          if (onError) {
            /** Call onError catching the error */
            onError(err);
          } else {
            /** Log the error to help debug */
            console.error(err);
          }
          return null;
        });
    })
    .catch((err) => {
      if (onError) {
        /** Call onError catching the error */
        onError(err);
      } else {
        /** Log the error to help debug */
        console.error(err);
      }

      return null;
    });
export default {
  APPLE_SCRIPT_SRC,
  signIn,
};
