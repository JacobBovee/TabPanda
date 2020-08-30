import { h } from 'preact';

interface IProps {
    type: 'more' | 'folder' | 'link' | 'triangle' | 'custom';
    iconSrc?: string;
    size?: number;
    className?: string;
}

const getAdjustedSize = (originalWidth: number, originalHeight: number, finalHeight: number) => {
    const adjustedWidth = finalHeight * (originalWidth / originalHeight);
    return {
        width: `${adjustedWidth}px`,
        height: `${finalHeight}px`
    }
}

export default function Icon(props: IProps) {
    const { type, iconSrc, size, className } = props;
    if (type === 'custom' && iconSrc) {
        const iconImg = new Image();
        iconImg.src = iconSrc;

        const { width, height } = getAdjustedSize(iconImg.width, iconImg.height, size || 12)
        const style = {
            width,
            height,
            backgroundImage: `url('${iconSrc}')`,
            backgroundSize: 'contain',
            display: 'inline-block'
        }

        return (
            <i className={`custom-icon ${className}`} style={style} />
        );
    }
    else {
        return (
            <i className={`${type}-icon ${className}`}></i>
        )
    }
}