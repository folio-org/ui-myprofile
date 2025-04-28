import { useTenantPreferences, usePreferences } from '@folio/stripes/core';
import { useQuery, useMutation } from 'react-query';

const DEFAULT_SETTINGS = {};

export const useSettings = ({ scope, key, userId }) => {
  const {
    setTenantPreference,
    getTenantPreference,
    removeTenantPreference,
  } = useTenantPreferences();

  const {
    setPreference,
    getPreference,
    removePreference,
  } = usePreferences();

  const { data, isLoading, refetch } = useQuery(
    ['settings', userId, scope, key],
    () => {
      if (userId) {
        return getPreference({ scope, key, userId });
      }

      return getTenantPreference({ scope, key });
    },
    {
      keepPreviousData: false,
    }
  );

  const { mutateAsync } = useMutation(
    (value) => {
      if (userId) {
        return setPreference({ scope, key, value });
      }

      return setTenantPreference({ scope, key, value });
    },
    {
      onSuccess: () => {
        refetch();
      },
    },
  );

  const { mutateAsync: deleteSetting } = useMutation(
    () => {
      if (userId) {
        return removePreference({ scope, key });
      }

      return removeTenantPreference({ scope, key });
    },
    {
      onSuccess: () => {
        refetch();
      },
    },
  );

  return {
    settings: data || DEFAULT_SETTINGS,
    isLoading,
    updateSetting: mutateAsync,
    removeSetting: deleteSetting,
  };
};
