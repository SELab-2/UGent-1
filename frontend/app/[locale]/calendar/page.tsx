import React from 'react';
import ProjectCalendar from '../components/ProjectCalendar';
import initTranslations from "@app/i18n";
import NavBar from '@app/[locale]/components/NavBar';
import TranslationsProvider from "@app/[locale]/components/TranslationsProvider";
import {Box, Typography} from "@mui/material";



const CalendarPage: React.FC = async ({params: {locale}}: { params: { locale: any } }) => {
    const {t, resources} = await initTranslations(locale, ['common'])

  return (
      <TranslationsProvider
            resources={resources}
            locale={locale}
            namespaces={["common"]}
        >
            <NavBar/>
          <Box
            padding={15}
          >
              <Typography
                    variant={"h3"}
                    align={"center"}
              >
                  {t("project_calendar")}
              </Typography>
              <ProjectCalendar/>
          </Box>
      </TranslationsProvider>
);
};

export default CalendarPage;
