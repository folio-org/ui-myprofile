import { Response } from '@bigtest/mirage';
import { wrongPassword, serverError, lastTenPasswordsError, multipleErrors } from '../constants';

// typical mirage config export
export default function configure() {
  this.get('/tenant/rules', (db, request) => {
    return new Response(200, {
      'X-Request-URL': request.url
    }, {
      rules: [],
      totalRecords: 0,
    });
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
}
