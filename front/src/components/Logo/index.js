import style from './style';

import logoSvg from './logo-horizontal.svg';

export default ({ className }) => (
  <img className={`${style.logo} ${className}`} src={logoSvg} />
);
