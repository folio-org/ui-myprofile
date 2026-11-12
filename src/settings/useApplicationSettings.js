import { useMemo } from 'react';

import { connectFor } from '@folio/stripes/connect';
import { useStripes, useModules, AppIcon } from '@folio/stripes/core';

const packageName = {
  PACKAGE_SCOPE_REGEX: /^@[a-z\d][\w-.]{0,214}\//,
};

/**
 * Iterate through enabled modules with `actsAs: [myprofile]` returning an
 * array of { route, label, component } objects:
 *   route: the module's stripes.route, stripped of its leading slash
 *   label: the module's icon and name
 *   component: wrapper around the module's default export
 * Delegate is a simple wrapper-component that exists merely to be able to pass
 * showMyprofile, so the module's router can inspect that prop and use it to
 * route to its MyProfile routes, just as the wrapper in stripes-core's Settings
 * components passes showSettings.
 *
 * @returns
 */
const useApplicationSettings = () => {
  const modules = useModules();
  const stripes = useStripes();

  const labelForModule = (m) => (
    <AppIcon
      alt={m.displayName}
      app={m.module}
      size="small"
    >
      {m.displayName}
    </AppIcon>
  );

 return useMemo(() => (modules.myprofile || [])
  .filter(x => stripes.hasPerm(`settings.${x.module.replace(packageName.PACKAGE_SCOPE_REGEX, '')}.enabled`))
  .sort((x, y) => x.displayName.toLowerCase().localeCompare(y.displayName.toLowerCase()))
  .map((m) => {
    try {
      const connect = connectFor(m.module, stripes.epics, stripes.logger);
      const ModuleComponent = connect(m.getModule());
      const moduleStripes = stripes.clone({ connect });

      // trim leading slashes so we can render relative routes under /settings/myprofile
      const route = m.route.replace(/^\//, '');

      const Delegate = (props) => (
        <ModuleComponent
          {...props}
          stripes={moduleStripes}
          showMyprofile
        />
      );

      return { route, label: labelForModule(m), component: Delegate };
    } catch (error) {
      console.error(`ERROR: could not load mysettings for ${m.module}`)
      console.error(error); // eslint-disable-line no-console
    }
  }), [modules.myprofile, stripes]);
};

export default useApplicationSettings;
