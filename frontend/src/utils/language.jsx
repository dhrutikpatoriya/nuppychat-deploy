import { LANGUAGE_TO_FLAG } from '../constants';

export function getLanguageFlag(language) {
  if(!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if(countryCode){
    return (
      <img 
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${language} flag`} 
        className='h-3 m-1 inline-block'
      />
    );
  }
  return null;
}
