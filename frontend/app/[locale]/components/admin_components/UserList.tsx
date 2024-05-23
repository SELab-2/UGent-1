import BackButton from "@app/[locale]/components/BackButton";
import ListView from "@app/[locale]/components/ListView";
import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import {useTranslation} from "react-i18next";


const UserList = () => {
    /*
    * This component displays the list of users.
    * It allows the admin to remove users.
    */
    const {t} = useTranslation();

    const headers = [
        <React.Fragment key="email"><EmailIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('email')}</React.Fragment>,
        ,
        <React.Fragment key="role"><WorkIcon style={{ fontSize: '20px', verticalAlign: 'middle', marginBottom: '3px' }}/>{" " + t('role')}</React.Fragment>
        , ''];
    const headers_backend = ['email', 'role', ''];

    return (
        <div
            style={{
                marginTop: 60,
                padding: 20,
                width: '100%',
        }}>
            <BackButton
                destination={'/home'}
                text={t('back_to') + ' ' + t('home') + ' ' + t('page')}
            />
            <ListView
                admin={true}
                headers={headers}
                headers_backend={headers_backend}
                sortable={[true, false]}
                get={'users'}
                action_name={'remove'}
                action_text={t('remove_user')}
                search_text={t('search')}
            />
        </div>
    );
}

export default UserList;