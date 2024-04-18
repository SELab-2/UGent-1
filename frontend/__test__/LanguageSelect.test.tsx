import { render, cleanup, waitForElement } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import LanguageSelect from '../app/[locale]/components/LanguageSelect';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key,
    i18n: {
      language: 'en',
    },
  }),
}));

const mockRouter = {
  route: '/',
  pathname: '/',
  query: { locale: 'en' },
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  basePath: '', // add this line
  isLocaleDomain: false, // add this line
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('LanguageSelect', () => {

  afterEach(cleanup);

  it('Should render correctly', async () => {
    // const { getByText } = render(
    //   <RouterContext.Provider value={mockRouter}>
    //     <LanguageSelect/>
    //   </RouterContext.Provider>,
    // );

    // await waitForElement(() => getByText(/en/i));
  });
});