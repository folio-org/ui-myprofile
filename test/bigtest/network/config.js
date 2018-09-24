import { okapi } from 'stripes-config'; // eslint-disable-line import/no-unresolved
import { Response } from '@bigtest/mirage';
import { wrongPassword, serverError, lastTenPasswordsError, multipleErrors } from '../constants';

// typical mirage config export
export default function configure() {
  this.urlPrefix = okapi.url;

  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('_/proxy/tenants/:id/modules', []);

  this.get('/saml/check', {
    ssoEnabled: false
  });

  this.post('/authn/update', (schema, request) => {
    const formData = JSON.parse(request.requestBody);

    switch (formData.password) {
      case multipleErrors:
        return new Response(400, {}, {
          errors: [
            {
              type: 'error',
              code: 'lastTenPasswords',
            },
            {
              type: 'error',
              code: 'wrongPassword',
            },
          ]
        });
      case lastTenPasswordsError:
        return new Response(400, {}, {
          errors: [
            {
              type: 'error',
              code: 'lastTenPasswords',
            },
          ]
        });
      case wrongPassword:
        return new Response(401, []);
      case serverError:
        return new Response(500, []);
      default:
        return new Response(201, []);
    }
  });

  // mod-users
  this.get('/users', []);

  // mod-users
  this.get('/service-points-users', {
    servicePointsUsers: []
  });

  // mod-config
  this.get('/configurations/entries', {
    configs: []
  });

  // mod-notify
  this.get('/notify/_self', {
    notifications: [],
    totalRecords: 0
  });

  this.get('/notify', {
    notifications: [],
    totalRecords: 0
  });

  // translation bundle passthrough
  this.pretender.get(`${__webpack_public_path__}translations/:rand.json`, this.pretender.passthrough); // eslint-disable-line

  // hot-reload passthrough
  this.pretender.get('/:rand.hot-update.json', this.pretender.passthrough);
}
