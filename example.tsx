import { lazy, memo, useMemo } from 'react';

import 'dayjs/locale/en';
import 'dayjs/locale/pt';
import 'dayjs/locale/fr';
import 'dayjs/locale/es';
import { isNil, equals } from 'ramda';
import { extend } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
  ListingPage,
  LicensedModule,
  QueryProvider,
  Store
} from '@centreon/ui';

import Context, { useJobsContext } from './Context';
import PanelEdit from './PanelEdit';
import useListing from './Listing/useListing';
import JobWizard from './JobWizard';

const Filters = lazy(() => import('./Listing/Filters'));
const JobListing = lazy(() => import('./Listing'));

extend(duration);
extend(relativeTime);
extend(timezone);
extend(utc);
extend(customParseFormat);
extend(localizedFormat);

interface ListingPageProps {
  handleCloseJobWizard: () => void;
  jobToEdit: number | null;
  openJobWizard: boolean;
}

const HDJobListingPage = ({
  jobToEdit,
  openJobWizard,
  handleCloseJobWizard
}: ListingPageProps): JSX.Element => (
  <>
    <ListingPage
      filter={<Filters />}
      listing={<JobListing />}
      panel={<PanelEdit />}
      panelOpen={!isNil(jobToEdit)}
    />
    {openJobWizard && (
      <JobWizard open={openJobWizard} onClose={handleCloseJobWizard} />
    )}
  </>
);

const MemoizedHDJobListingPage = memo(
  HDJobListingPage,
  (prevProps, nextProps) =>
    equals(prevProps.jobToEdit, nextProps.jobToEdit) &&
    equals(prevProps.openJobWizard, nextProps.openJobWizard)
);

export const HDJobsPage = (): JSX.Element => {
  const { jobToEdit, openJobWizard, handleCloseJobWizard } = useJobsContext();

  return (
    <MemoizedHDJobListingPage
      handleCloseJobWizard={handleCloseJobWizard}
      jobToEdit={jobToEdit}
      openJobWizard={openJobWizard}
    />
  );
};

export const HDJobsPageWithContext = (): JSX.Element => {
  const listingContext = useListing();

  const contextValues = useMemo(
    () => ({
      ...listingContext
    }),
    [listingContext]
  );

  return (
    <Context.Provider value={contextValues}>
      <HDJobsPage />
    </Context.Provider>
  );
};

const HDJobsPageWithLicenseValidation = ({
  store
}: {
  store: Store;
}): JSX.Element => (
  <QueryProvider>
    <LicensedModule
      maxSnackbars={1}
      moduleName="epp"
      seedName="centreon-auto-discovery-jobs"
      store={store}
    >
      <HDJobsPageWithContext />
    </LicensedModule>
  </QueryProvider>
);

export default HDJobsPageWithLicenseValidation;
