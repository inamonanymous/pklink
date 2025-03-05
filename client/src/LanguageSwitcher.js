import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className='btn-con'>
      <button className='btn btn-info btn-sm' onClick={() => i18n.changeLanguage('en')}>English</button>
      <button className='btn btn-success btn-sm' onClick={() => i18n.changeLanguage('fil')}>Filipino</button>
    </div>
  );
};

export default LanguageSwitcher;
