import { IconsProps } from './Icon.props';
import './Icon.css';

export function Icon({src, alt, classNames, ...props}: IconsProps) {
	return <img src={src} alt={alt} className={classNames} {...props} />;
}